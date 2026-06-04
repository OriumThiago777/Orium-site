# Google Drive PDF Upload — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar infraestrutura para upload automático de PDFs ao Google Drive e registro no Notion, sem alterar nenhuma página existente.

**Architecture:** Uma rota POST `/api/upload-pdf` recebe um multipart/form-data com o PDF + metadata, usa `lib/google-drive.ts` para autenticar via JWT service account, criar/reutilizar pasta do cliente no Drive, fazer upload e tornar público. Em seguida registra no Notion DB Documentos. `lib/upload-helper.ts` encapsula essa chamada para uso no frontend.

**Tech Stack:** Next.js 16 App Router, TypeScript, `googleapis` (Google Drive API v3), Notion REST API, Node.js `stream.Readable`

---

## File Map

| Arquivo | Ação | Responsabilidade |
|---------|------|-----------------|
| `orium-site/lib/google-drive.ts` | Criar | Auth JWT, `getOrCreateClientFolder`, `uploadPdfToDrive` |
| `orium-site/app/api/upload-pdf/route.ts` | Criar | POST handler: parse multipart, chama Drive, chama Notion |
| `orium-site/lib/upload-helper.ts` | Criar | Helper frontend: `savePdfToCloud()` |
| `orium-site/.env.local` | Modificar | Adicionar 3 vars do Google (manual — chave privada sensível) |
| `orium-site/package.json` | Modificar | `googleapis` adicionado via npm install |

---

## Task 1: Instalar googleapis

**Files:**
- Modify: `orium-site/package.json` (via npm)

- [ ] **Step 1: Instalar o pacote**

```bash
cd orium-site
npm install googleapis
```

Expected output: `added N packages` sem erros.

- [ ] **Step 2: Verificar que apareceu nas dependências**

```bash
grep googleapis package.json
```

Expected: `"googleapis": "^X.X.X"` em `dependencies`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: instalar googleapis para upload ao Google Drive"
```

---

## Task 2: Adicionar variáveis de ambiente do Google

**Files:**
- Modify: `orium-site/.env.local` (edição manual — nunca commitar esse arquivo)

> ⚠️ Este passo é **manual**. Abra o arquivo JSON da service account que você baixou do Google Cloud Console.

- [ ] **Step 1: Abrir `.env.local` e adicionar as três linhas abaixo**

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=orium-810@orium-498413.iam.gserviceaccount.com
GOOGLE_DRIVE_ROOT_FOLDER_ID=1ss9N2bC7D6l8rjeYPFyrmFDcLZlbFmxr
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nCOLE_AQUI_O_CONTEUDO\n-----END PRIVATE KEY-----\n"
```

- [ ] **Step 2: Preencher `GOOGLE_PRIVATE_KEY`**

No JSON da service account, copie o valor do campo `"private_key"`. Cole diretamente entre as aspas duplas. O valor já contém `\n` literais — mantenha exatamente como está (não substitua por quebras de linha reais no arquivo).

Resultado esperado no arquivo:
```
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...resto_da_chave...\n-----END PRIVATE KEY-----\n"
```

- [ ] **Step 3: Verificar que `.env.local` está no `.gitignore`**

```bash
grep "\.env\.local" .gitignore
```

Expected: linha encontrada. Se não estiver, adicionar `*.env.local` ao `.gitignore`.

> Não há commit neste task — `.env.local` nunca é versionado.

---

## Task 3: Criar `lib/google-drive.ts`

**Files:**
- Create: `orium-site/lib/google-drive.ts`

- [ ] **Step 1: Criar o arquivo com o seguinte conteúdo exato**

```typescript
import { google } from 'googleapis'
import { Readable } from 'stream'

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/drive'],
})

const drive = google.drive({ version: 'v3', auth })

export async function getOrCreateClientFolder(clientName: string): Promise<string> {
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID!

  const search = await drive.files.list({
    q: `name='${clientName}' and '${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
  })

  if (search.data.files && search.data.files.length > 0) {
    return search.data.files[0].id!
  }

  const folder = await drive.files.create({
    requestBody: {
      name: clientName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [rootFolderId],
    },
    fields: 'id',
  })

  return folder.data.id!
}

export async function uploadPdfToDrive(
  pdfBuffer: Buffer,
  fileName: string,
  clientName: string
): Promise<{ fileId: string; fileUrl: string }> {
  const folderId = await getOrCreateClientFolder(clientName)

  const stream = Readable.from(pdfBuffer)

  const file = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: 'application/pdf',
      parents: [folderId],
    },
    media: {
      mimeType: 'application/pdf',
      body: stream,
    },
    fields: 'id, webViewLink',
  })

  await drive.permissions.create({
    fileId: file.data.id!,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  })

  return {
    fileId: file.data.id!,
    fileUrl: file.data.webViewLink!,
  }
}
```

- [ ] **Step 2: Verificar tipagem (sem rodar o servidor)**

```bash
npx tsc --noEmit
```

Expected: sem erros. Se reportar erro no `googleapis`, rode `npm install @types/node` (Node types podem estar faltando).

- [ ] **Step 3: Commit**

```bash
git add lib/google-drive.ts
git commit -m "feat: utilitário Google Drive — upload de PDF por cliente"
```

---

## Task 4: Criar `app/api/upload-pdf/route.ts`

**Files:**
- Create: `orium-site/app/api/upload-pdf/route.ts`

- [ ] **Step 1: Criar o arquivo com o seguinte conteúdo exato**

```typescript
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

    await fetch('https://api.notion.com/v1/pages', {
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

    return NextResponse.json({ success: true, fileId, fileUrl })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verificar tipagem**

```bash
npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add app/api/upload-pdf/route.ts
git commit -m "feat: API route POST /api/upload-pdf — Drive + Notion"
```

---

## Task 5: Criar `lib/upload-helper.ts`

**Files:**
- Create: `orium-site/lib/upload-helper.ts`

- [ ] **Step 1: Criar o arquivo com o seguinte conteúdo exato**

```typescript
export async function savePdfToCloud(
  pdfBlob: Blob,
  clientName: string,
  docType: string,
  fileName: string
): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append('file', pdfBlob, fileName)
    formData.append('clientName', clientName)
    formData.append('docType', docType)
    formData.append('fileName', fileName)

    const res = await fetch('/api/upload-pdf', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    return { success: true, fileUrl: data.fileUrl }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return { success: false, error: message }
  }
}
```

- [ ] **Step 2: Verificar tipagem**

```bash
npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add lib/upload-helper.ts
git commit -m "feat: helper frontend savePdfToCloud para upload de PDFs"
```

---

## Task 6: Verificar campo 'Link Drive' no Notion e testar end-to-end

**Files:** nenhum arquivo de código

- [ ] **Step 1: Adicionar propriedade no Notion (manual)**

1. Abrir a database **Documentos Gerados** no Notion (ID: `8c07ef2e-7756-4ba4-99e2-e2f35b7afdde`)
2. Clicar em `+` para adicionar coluna
3. Nome: `Link Drive`, tipo: **URL**
4. Salvar

- [ ] **Step 2: Subir o servidor de desenvolvimento**

```bash
npm run dev
```

Expected: `▲ Next.js 16.x.x` rodando em `http://localhost:3000`

- [ ] **Step 3: Preparar um PDF de teste qualquer**

Qualquer arquivo `.pdf` no computador serve. Anote o caminho completo.

- [ ] **Step 4: Testar via curl (PowerShell)**

```powershell
curl.exe -X POST http://localhost:3000/api/upload-pdf `
  -F "file=@C:\caminho\para\arquivo.pdf" `
  -F "clientName=Teste Cliente" `
  -F "docType=Relatório" `
  -F "fileName=relatorio-teste-cliente.pdf"
```

Expected:
```json
{ "success": true, "fileId": "1abc...", "fileUrl": "https://drive.google.com/file/d/..." }
```

- [ ] **Step 5: Verificar no Google Drive**

1. Abrir o Drive com a conta da service account (ou usar link retornado)
2. Dentro da pasta ORIUM, deve existir uma subpasta `Teste Cliente`
3. Dentro dela, `relatorio-teste-cliente.pdf`
4. Abrindo o link `fileUrl` no browser deve mostrar o PDF (acesso público)

- [ ] **Step 6: Verificar no Notion**

1. Abrir database Documentos Gerados
2. Deve existir nova linha: Nome=`relatorio-teste-cliente.pdf`, Tipo=`Relatório`, Cliente=`Teste Cliente`, Link Drive=URL do Drive, Data de Geração=hoje

- [ ] **Step 7: Testar validação (campo faltando)**

```powershell
curl.exe -X POST http://localhost:3000/api/upload-pdf `
  -F "file=@C:\caminho\para\arquivo.pdf" `
  -F "clientName=Teste Cliente"
```

Expected:
```json
{ "error": "Campos obrigatórios ausentes" }
```
HTTP status: 400

---

## Checklist de Self-Review

- [x] `googleapis` instalado (Task 1)
- [x] Env vars documentadas, GOOGLE_PRIVATE_KEY com `\n` literal (Task 2)
- [x] `lib/google-drive.ts` usa `Readable` importado, não `require()` inline (Task 3)
- [x] `route.ts` usa `'Data de Geração'` (não `'Data'`) — alinhado com schema existente (Task 4)
- [x] `upload-helper.ts` trata erro com `instanceof Error` para satisfazer TypeScript strict (Task 5)
- [x] Teste end-to-end cobre happy path + validação de campos (Task 6)
- [x] Nenhuma página existente é tocada em nenhum task
