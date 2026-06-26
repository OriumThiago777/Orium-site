import { readFileSync } from 'fs'
import { resolve } from 'path'

// Lê o NOTION_TOKEN do .env.local se não estiver no ambiente
if (!process.env.NOTION_TOKEN) {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
    const envContent = readFileSync(envPath, 'utf8')
    for (const line of envContent.split('\n')) {
      const [key, ...rest] = line.split('=')
      if (key?.trim() === 'NOTION_TOKEN') {
        process.env.NOTION_TOKEN = rest.join('=').trim()
        break
      }
    }
  } catch {}
}

const NOTION_TOKEN = process.env.NOTION_TOKEN
const PARENT_PAGE_ID = '3795a6475cf2815cab58f08c2a7c63fe'

if (!NOTION_TOKEN) {
  console.error('❌ NOTION_TOKEN não encontrado. Defina no ambiente ou no .env.local')
  process.exit(1)
}

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

const body = {
  parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
  title: [{ type: 'text', text: { content: 'Campanhas' } }],
  properties: {
    'Título': { title: {} },
    'Cliente': {
      select: {
        options: [
          { name: 'altemans', color: 'orange' },
          { name: 'marcelo', color: 'blue' },
          { name: 'cortex', color: 'green' },
          { name: 'ekipar', color: 'purple' },
        ]
      }
    },
    'Tipo': {
      select: {
        options: [
          { name: 'Tráfego Pago', color: 'orange' },
          { name: 'Feriado', color: 'blue' },
          { name: 'Lançamento', color: 'purple' },
          { name: 'Promoção', color: 'green' },
          { name: 'Data Comemorativa', color: 'yellow' },
          { name: 'Outro', color: 'gray' },
        ]
      }
    },
    'Data Início': { date: {} },
    'Data Fim': { date: {} },
    'Objetivo': { rich_text: {} },
    'Orçamento': { rich_text: {} },
    'Plataformas': {
      multi_select: {
        options: [
          { name: 'Instagram', color: 'pink' },
          { name: 'Facebook', color: 'blue' },
          { name: 'Google', color: 'red' },
          { name: 'WhatsApp', color: 'green' },
          { name: 'YouTube', color: 'red' },
        ]
      }
    },
    'Status': {
      select: {
        options: [
          { name: 'Planejada', color: 'gray' },
          { name: 'Em andamento', color: 'green' },
          { name: 'Encerrada', color: 'default' },
          { name: 'Cancelada', color: 'red' },
        ]
      }
    },
    'Observações': { rich_text: {} },
  }
}

const res = await fetch('https://api.notion.com/v1/databases', {
  method: 'POST',
  headers,
  body: JSON.stringify(body),
})

const data = await res.json()

if (!res.ok) {
  console.error('❌ Erro da API Notion:', JSON.stringify(data, null, 2))
  process.exit(1)
}

console.log('✅ Database criada com sucesso!')
console.log('ID:', data.id)
console.log('Adicione ao .env.local: NOTION_DB_CAMPANHAS=' + data.id.replace(/-/g, ''))
