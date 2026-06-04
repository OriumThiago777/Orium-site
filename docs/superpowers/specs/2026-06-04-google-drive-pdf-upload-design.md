---
name: google-drive-pdf-upload
description: Upload automático de PDFs para Google Drive com registro no Notion
metadata:
  type: project
---

# Design — Upload de PDF para Google Drive + Notion

**Data:** 2026-06-04  
**Projeto:** orium-site (Next.js + TypeScript + Tailwind)

## Contexto

As ferramentas internas (/raio-x, /proposta, /contrato) geram PDFs localmente via jsPDF/html2canvas. Este bloco implementa a infraestrutura para salvar esses PDFs no Google Drive e registrar no Notion, sem ainda conectar aos botões existentes.

## Recursos externos

- **Service Account:** orium-810@orium-498413.iam.gserviceaccount.com
- **Pasta raiz Drive (ORIUM):** `1ss9N2bC7D6l8rjeYPFyrmFDcLZlbFmxr`
- **Notion DB Documentos:** `8c07ef2e-7756-4ba4-99e2-e2f35b7afdde` (já existe, em uso)

## Arquitetura

```
Frontend (qualquer página)
    ↓ Blob + metadata
lib/upload-helper.ts          → encapsula fetch para /api/upload-pdf
    ↓ POST multipart/form-data
app/api/upload-pdf/route.ts   → orquestra Drive + Notion
    ↓ Buffer
lib/google-drive.ts           → JWT auth, pasta por cliente, upload, permissão pública
    ↓ fileId + webViewLink
    → POST Notion /v1/pages   → Nome, Tipo, Cliente, Link Drive (URL), Data de Geração
```

## Arquivos a criar

| Arquivo | Descrição |
|---------|-----------|
| `lib/google-drive.ts` | Utilitário: auth JWT, `getOrCreateClientFolder`, `uploadPdfToDrive` |
| `app/api/upload-pdf/route.ts` | API route POST: recebe multipart, chama Drive, registra Notion |
| `lib/upload-helper.ts` | Helper frontend: `savePdfToCloud(blob, clientName, docType, fileName)` |

## Variáveis de ambiente a adicionar (.env.local)

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=orium-810@orium-498413.iam.gserviceaccount.com
GOOGLE_DRIVE_ROOT_FOLDER_ID=1ss9N2bC7D6l8rjeYPFyrmFDcLZlbFmxr
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Esquema Notion (campos usados pelo upload-pdf)

Campos **existentes** no DB (aproveitados):
- `Nome` — title
- `Tipo` — select
- `Cliente` — rich_text
- `Data de Geração` — date (**usa este, não 'Data'**)

Campo **novo** a adicionar manualmente no Notion:
- `Link Drive` — URL

## Comportamento da pasta no Drive

- Estrutura: `ORIUM / {clientName} / {fileName}.pdf`
- Pasta do cliente criada automaticamente se não existir
- Arquivo público via link (role: reader, type: anyone)

## Tratamento de erros (fase 1)

- Drive falha → retorna 500, Notion não é tocado
- Notion falha após Drive → arquivo já está no Drive, rota retorna erro (aceitável por ora)
- Tratamento transacional fica para Bloco 3 (integração com botões)

## Dependência

`googleapis` — instalar via `npm install googleapis` na pasta `orium-site/`

## Fora do escopo (este bloco)

- Nenhuma página existente é alterada
- Nenhum botão de PDF é conectado
- Sem retry ou rollback em caso de falha parcial
