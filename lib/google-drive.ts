import { google } from 'googleapis'
import { Readable } from 'stream'

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
)
auth.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN })

const drive = google.drive({ version: 'v3', auth })

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export async function getOrCreateClientFolder(clientName: string): Promise<string> {
  const rootFolderId = requireEnv('GOOGLE_DRIVE_ROOT_FOLDER_ID')
  const safeName = clientName.replace(/'/g, "\\'")

  const search = await drive.files.list({
    q: `name='${safeName}' and '${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
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
