import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function carregarEnvLocal() {
  const caminho = join(__dirname, '..', '.env.local')
  const conteudo = readFileSync(caminho, 'utf-8')
  for (const linha of conteudo.split('\n')) {
    const l = linha.trim()
    if (!l || l.startsWith('#')) continue
    const idx = l.indexOf('=')
    if (idx === -1) continue
    const chave = l.slice(0, idx).trim()
    const valor = l.slice(idx + 1).trim()
    if (!process.env[chave]) process.env[chave] = valor
  }
}

carregarEnvLocal()

const TOKEN = process.env.NOTION_TOKEN
const DB_ID = process.env.NOTION_DB_CALENDARIO

if (!TOKEN || !DB_ID) {
  console.error('NOTION_TOKEN ou NOTION_DB_CALENDARIO ausente em .env.local')
  process.exit(1)
}

const HEADERS = {
  'Authorization': `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

async function main() {
  const dbRes = await fetch(`https://api.notion.com/v1/databases/${DB_ID}`, { headers: HEADERS })
  const db = await dbRes.json()
  if (!dbRes.ok) {
    console.error('Falha ao ler a database:', db)
    process.exit(1)
  }

  if (db.properties?.['Última Edição']) {
    console.log('Propriedade "Última Edição" já existe — nada a fazer.')
    return
  }

  const patchRes = await fetch(`https://api.notion.com/v1/databases/${DB_ID}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({
      properties: {
        'Última Edição': { rich_text: {} },
      },
    }),
  })
  const patched = await patchRes.json()
  if (!patchRes.ok) {
    console.error('Falha ao criar a propriedade:', patched)
    process.exit(1)
  }

  console.log('Propriedade "Última Edição" (rich_text) criada com sucesso na database Calendário ORIUM.')
}

main()
