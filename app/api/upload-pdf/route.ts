import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { Readable } from 'stream'

export async function POST(req: NextRequest) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID

  if (!clientId || !clientSecret || !refreshToken || !rootFolderId) {
    return NextResponse.json({ success: false, error: 'Credenciais não configuradas' })
  }

  try {
    const { pdfBase64, clientName, docType, fileName } = await req.json()

    if (!pdfBase64 || !clientName || !docType || !fileName) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios ausentes' })
    }

    const auth = new google.auth.OAuth2(clientId, clientSecret)
    auth.setCredentials({ refresh_token: refreshToken })
    const drive = google.drive({ version: 'v3', auth })

    const buffer = Buffer.from(pdfBase64, 'base64')
    const stream = Readable.from(buffer)

    const file = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: 'application/pdf',
        parents: [rootFolderId],
      },
      media: {
        mimeType: 'application/pdf',
        body: stream,
      },
      fields: 'id, webViewLink',
    })

    await drive.permissions.create({
      fileId: file.data.id!,
      requestBody: { role: 'reader', type: 'anyone' },
    })

    const fileId = file.data.id!
    const fileUrl = file.data.webViewLink!

    // Registro no Notion — atualiza o registro criado por /api/documentos com o Link Drive.
    // Falha silenciosa para não bloquear o retorno de sucesso.
    try {
      const notionToken = process.env.NOTION_TOKEN
      const notionDb = process.env.NOTION_DB_DOCUMENTOS
      if (notionToken && notionDb) {
        const NH = {
          'Authorization': `Bearer ${notionToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        }

        const buscarRegistro = async (): Promise<string | null> => {
          const res = await fetch(`https://api.notion.com/v1/databases/${notionDb}/query`, {
            method: 'POST',
            headers: NH,
            body: JSON.stringify({
              filter: {
                and: [
                  { property: 'Cliente', rich_text: { equals: clientName } },
                  { property: 'Tipo', select: { equals: docType } },
                ],
              },
              sorts: [{ property: 'Data de Geração', direction: 'descending' }],
              page_size: 1,
            }),
          })
          if (!res.ok) return null
          const data = await res.json()
          return data.results?.[0]?.id ?? null
        }

        // O registro é criado por /api/documentos em paralelo ao upload — espera
        // antes de buscar e tenta uma segunda vez antes de cair no fallback
        await new Promise(r => setTimeout(r, 1500))
        let pageId = await buscarRegistro()
        if (!pageId) {
          await new Promise(r => setTimeout(r, 2000))
          pageId = await buscarRegistro()
        }

        let notionRes: Response
        if (pageId) {
          notionRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'PATCH',
            headers: NH,
            body: JSON.stringify({ properties: { 'Link Drive': { url: fileUrl } } }),
          })
        } else {
          // Fallback: ferramenta não registrou em /api/documentos (ex.: Briefing, Relatório)
          notionRes = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: NH,
            body: JSON.stringify({
              parent: { database_id: notionDb },
              properties: {
                'Nome': { title: [{ text: { content: `${docType} — ${clientName}` } }] },
                'Tipo': { select: { name: docType } },
                'Cliente': { rich_text: [{ text: { content: clientName } }] },
                'Data de Geração': { date: { start: new Date().toISOString() } },
                'ID Documento': { rich_text: [{ text: { content: crypto.randomUUID() } }] },
                'Link Drive': { url: fileUrl },
              },
            }),
          })
        }
        if (!notionRes.ok) {
          const body = await notionRes.json()
          console.error('Notion registration failed:', notionRes.status, JSON.stringify(body))
        }
      }
    } catch (notionErr) {
      console.error('Notion registration error:', notionErr)
    }

    return NextResponse.json({ success: true, fileId, fileUrl })
  } catch (error) {
    const err = error as Error
    console.error('Upload error:', err?.message, err?.stack)
    return NextResponse.json({ success: false, error: err?.message ?? 'Erro desconhecido' })
  }
}
