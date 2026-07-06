import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const correct = process.env.ALTEMANS_PANEL_PASSWORD;
  if (!correct) {
    return NextResponse.json({ error: 'Configuração ausente no servidor.' }, { status: 500 });
  }

  let body: { senha?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ok = body.senha === correct;
  return NextResponse.json({ ok });
}
