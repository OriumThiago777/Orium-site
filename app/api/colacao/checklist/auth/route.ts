import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { senha } = await request.json();
  const senhaCorreta = process.env.COLACAO_CHECKLIST_PASSWORD;

  if (!senhaCorreta) {
    return NextResponse.json({ error: 'Senha não configurada no servidor.' }, { status: 500 });
  }

  if (senha === senhaCorreta) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
}
