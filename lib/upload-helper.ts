export async function savePdfToCloud(
  pdfBlob: Blob,
  clientName: string,
  docType: string,
  fileName: string
): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer()
    const pdfBase64 = Buffer.from(arrayBuffer).toString('base64')

    const res = await fetch('/api/upload-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfBase64, clientName, docType, fileName }),
    })

    const data = await res.json()
    if (!data.success) throw new Error(data.error ?? 'Erro no upload')

    return { success: true, fileUrl: data.fileUrl }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return { success: false, error: message }
  }
}
