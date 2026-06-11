export function verificarToken(request: Request): boolean {
  const auth = request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return false
  const token = auth.slice('Bearer '.length)
  const senha = process.env.RAIO_X_PASSWORD
  if (!senha) return false
  return token === senha
}

export function respostaNaoAutorizada() {
  return new Response(JSON.stringify({ error: 'Não autorizado' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}
