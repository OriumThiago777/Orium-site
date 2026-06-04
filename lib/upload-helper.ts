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
