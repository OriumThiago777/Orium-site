import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    nomeCliente, instagram, segmento, mes,
    objetivo, tomVoz, diferencial, publico,
    frequencia, formatos, temas, datasEspeciais, observacoes
  } = body;

  const postsSemanais = parseInt(frequencia.split('x')[0]);
  const totalPosts = postsSemanais * 4;

  const prompt = `Você é um estrategista de conteúdo digital especializado em negócios locais brasileiros.

Crie um calendário de conteúdo mensal completo para o seguinte cliente:

CLIENTE: ${nomeCliente}
${instagram ? `INSTAGRAM: ${instagram}` : ''}
SEGMENTO: ${segmento}
MÊS: ${mes}
OBJETIVO DO MÊS: ${objetivo}
TOM DE VOZ: ${tomVoz}
DIFERENCIAL DA MARCA: ${diferencial}
PÚBLICO-ALVO: ${publico}
FREQUÊNCIA: ${frequencia} de posts
FORMATOS DISPONÍVEIS: ${formatos.join(', ')}
TEMAS RECORRENTES: ${temas.join(', ')}
${datasEspeciais ? `DATAS ESPECIAIS: ${datasEspeciais}` : ''}
${observacoes ? `OBSERVAÇÕES: ${observacoes}` : ''}

Gere exatamente ${totalPosts} posts distribuídos em 4 semanas (${postsSemanais} por semana).

REGRAS OBRIGATÓRIAS:
1. Não repita o mesmo formato 2x seguidas
2. Não repita o mesmo tema 2x seguidas
3. Distribua os temas ao longo das semanas de forma estratégica
4. Se houver datas especiais, inclua o post na semana correta
5. O conteúdo deve ser específico para o segmento e o cliente — nada genérico
6. Tom de voz deve ser consistente em todas as legendas
7. Legendas devem ter 2-3 linhas — diretas, com gancho e CTA

Responda SOMENTE com um JSON válido, sem texto antes ou depois, sem markdown, sem backticks, neste formato exato:

{
  "semanas": [
    {
      "numero": 1,
      "titulo": "Semana 1",
      "posts": [
        {
          "numero": "01",
          "diaSemana": "Segunda",
          "formato": "Carrossel",
          "tema": "Dica rápida",
          "titulo": "Título específico e atraente do post",
          "legenda": "Primeira linha de gancho.\\n\\nDesenvolvimento em 1-2 linhas.\\n\\nCTA direto.",
          "hashtags": "#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5"
        }
      ]
    }
  ]
}`;

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chave da API não configurada.' }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Erro na geração:', err);
    return NextResponse.json({ error: 'Erro ao gerar calendário' }, { status: 500 });
  }
}
