import { NextRequest, NextResponse } from 'next/server'
import { uploadPdfToDrive } from '@/lib/google-drive'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const clientName = formData.get('clientName') as string
    const docType = formData.get('docType') as string
    const fileName = formData.get('fileName') as string

    if (!file || !clientName || !docType || !fileName) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { fileId, fileUrl } = await uploadPdfToDrive(buffer, fileName, clientName)

    const notionToken = process.env.NOTION_TOKEN
    const notionDb = process.env.NOTION_DB_DOCUMENTOS

    if (!notionToken || !notionDb) {
      throw new Error('Missing NOTION_TOKEN or NOTION_DB_DOCUMENTOS')
    }

    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: notionDb },
        properties: {
          Nome: {
            title: [{ text: { content: fileName } }],
          },
          Tipo: {
            select: { name: docType },
          },
          Cliente: {
            rich_text: [{ text: { content: clientName } }],
          },
          'Link Drive': {
            url: fileUrl,
          },
          'Data de Geração': {
            date: { start: new Date().toISOString().split('T')[0] },
          },
        },
      }),
    })

    if (!notionRes.ok) {
      const body = await notionRes.json()
      throw new Error(`Notion error ${notionRes.status}: ${JSON.stringify(body)}`)
    }

    return NextResponse.json({ success: true, fileId, fileUrl })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
