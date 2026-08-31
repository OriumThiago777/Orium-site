# Guitarra e Voz — Spec Original (colado pelo Thiago em 31/08/2026)

> Este arquivo preserva o conteúdo bruto colado pelo Thiago no chat, sem edição, para servir de
> referência única para todos os planos de implementação do projeto pessoal "Guitarra e Voz".
> Decisão tomada na mesma sessão: o projeto será embutido dentro deste repositório (orium-site),
> como projeto pessoal à parte — mesmo padrão de `/colacao-de-grau` (sem identidade visual ORIUM,
> sem menção à ORIUM, senha/autenticação e persistência próprias se e quando necessárias).

---

# MÓDULO 8 — Teoria Aplicada
## Conteúdo das Aulas — Baseado em "Acordes, Arpejos e Escalas" (Nelson Faria)

Referência principal: *Acordes, Arpejos e Escalas para Violão e Guitarra* — Nelson Faria (Lumiar Editora)

---

## AULA 8.1 — Notas musicais e o braço da guitarra

### Objetivo principal
Localizar as 12 notas musicais no braço da guitarra e entender a lógica que organiza o instrumento.

### Por que isso importa
Quem não conhece as notas no braço depende de cifras para sempre. Quem conhece começa a entender por que os acordes soam como soam, consegue transpor músicas com capotraste ou sem ele, e começa a "ver" o instrumento em vez de só memorizá-lo.

### Explicação teórica

As 12 notas da escala cromática são:

```
Dó — Dó# / Réb — Ré — Ré# / Mib — Mi — Fá — Fá# / Solb — Sol — Sol# / Láb — Lá — Lá# / Sib — Si
```

A distância entre uma nota e sua vizinha imediata é um **semitom**.
A distância de dois semitons é um **tom**.

Na guitarra:
- Uma casa = um semitom
- Duas casas = um tom

**Localização das notas nas cordas soltas:**
```
6ª corda (mais grossa): Mi  (E)
5ª corda: Lá  (A)
4ª corda: Ré  (D)
3ª corda: Sol (G)
2ª corda: Si  (B)
1ª corda: Mi  (E)
```

**Exercício de localização:**
Siga o padrão abaixo para a 6ª corda (E), e repita o raciocínio para as demais:

```
Corda 6: E  | F | F# | G | G# | A | A# | B | C | C# | D | D# | E
Casa:     0    1    2    3    4    5    6    7    8    9   10   11   12
```

A nota na 12ª casa é sempre a mesma nota da corda solta, uma oitava acima.

### Exercício técnico
Toque cada nota em sequência da corda solta até a 12ª casa, dizendo o nome da nota em voz alta. Faça isso nas 6 cordas. Não precisa ser rápido — o objetivo é criar a associação visual/auditiva.

### Meta mensurável
Dado o nome de qualquer nota (ex.: "Fá#"), você consegue encontrá-la em pelo menos 3 posições diferentes no braço em menos de 10 segundos.

### Checklist
- [ ] Conheço os nomes das notas nas cordas soltas
- [ ] Sei que uma casa = um semitom
- [ ] Localizei Lá (A) em pelo menos 4 posições no braço
- [ ] Localizei Dó (C) em pelo menos 3 posições
- [ ] Entendo que a 12ª casa = mesma nota da corda solta

---

## AULA 8.2 — Formação de acordes: tríades e tétrades

### Objetivo principal
Entender como os acordes são construídos a partir de intervalos, aplicando a nomenclatura do Nelson Faria.

### Explicação teórica

Nelson Faria explica que os acordes são formados por superposição de terças. O sistema de graus (1, 2, 3, 4, 5, 6, 7 e suas alterações com b e #) permite descrever qualquer acorde independentemente da tonalidade.

**Tabela de intervalos (do livro):**

| Número | Nome |
|--------|------|
| 1 | Tônica (fundamental) |
| b2 | Segunda menor |
| 2 | Segunda maior |
| b3 | Terça menor |
| 3 | Terça maior |
| 4 | Quarta justa |
| b5 | Quinta diminuta |
| 5 | Quinta justa |
| b6 | Sexta menor |
| 6 | Sexta maior |
| b7 | Sétima menor |
| 7 | Sétima maior |

### Tríades (3 sons)

Uma tríade é formada por: fundamental + terça + quinta.

| Tipo | Fórmula | Exemplo em Dó |
|------|---------|---------------|
| Maior | 1-3-5 | C |
| Menor | 1-b3-5 | Cm |
| Aumentada | 1-3-#5 | C(#5) |
| Diminuta | 1-b3-b5 | C° |

### Tétrades (4 sons)

Uma tétrade acrescenta a sétima à tríade.

| Tipo | Fórmula | Cifra | Exemplo |
|------|---------|-------|---------|
| Sétima maior | 1-3-5-7 | C7M | C com sétima maior |
| Menor com sétima | 1-b3-5-b7 | Cm7 | C com sétima menor |
| Dominante | 1-3-5-b7 | C7 | C com sétima menor |
| Diminuto | 1-b3-b5-bb7 | C° | C diminuto |
| Meio-diminuto | 1-b3-b5-b7 | Cm7(b5) | C meio-diminuto |
| Menor com 7M | 1-b3-5-7 | Cm(7M) | C menor com sétima maior |
| 7M com quinta aumentada | 1-3-#5-7 | C7M(#5) | C com quinta aumentada |

### Como usar esse conhecimento

Quando você vê "Am7" numa cifra, agora você sabe:
- A = tônica (Lá)
- m = terça menor (b3 = Dó)
- 7 = sétima menor (b7 = Sol)
- A quinta justa (5 = Mi) está implícita

Isso explica por que Am7 soa da forma que soa.

### Meta mensurável
Dado um cifra simples (Am, G7, Dm7, C7M), você consegue identificar quais graus compõem o acorde sem consultar material.

### Checklist
- [ ] Entendo que tríade = fundamental + terça + quinta
- [ ] Sei diferenciar terça maior (3) de terça menor (b3)
- [ ] Sei o que a letra "M" e o número "7" significam numa cifra
- [ ] Consigo identificar os graus de: Am, Em, C7M, Dm7

---

## AULA 8.3 — Acordes no braço: formas fechadas e inversões

### Objetivo principal
Aprender que o mesmo acorde tem múltiplas formas no braço, e entender o conceito de inversão.

### Explicação teórica

Nelson Faria organiza os acordes por posição da fundamental no braço:

**Acordes com fundamental na 6ª corda:**
Os barres a partir da 6ª corda seguem o padrão da forma E (aberta).

**Acordes com fundamental na 5ª corda:**
Os barres a partir da 5ª corda seguem o padrão da forma A (aberta).

**Acordes com fundamental na 4ª corda:**
Usados em voicings de jazz e acordes de 4 notas sem quintas.

**Inversões**

Um acorde está em estado fundamental quando a fundamental está no baixo.

Está invertido quando outra nota do acorde está no baixo:
- 1ª inversão: terça no baixo → notação: C7M/E
- 2ª inversão: quinta no baixo → notação: C7M/G
- 3ª inversão: sétima no baixo → notação: C7M/B

Na prática do rock/pop brasileiro, inversões aparecem frequentemente como notas de baixo pedal ou movimentação de linha de baixo.

**Exemplo prático — "Pais e Filhos" usa:**
Am — G — F — Em

A sequência Am → G → F tem um movimento de baixo: A → G → F (descendo um tom de cada vez). Isso é uma linha de baixo, não exatamente inversão, mas o princípio é o mesmo.

**Exemplo com inversão real:**
G/B (Sol com Si no baixo) é comum em músicas como "Wish You Were Here" — a linha de baixo desce de G para B para Am.

### Exercício aplicado
Toque a progressão G — G/B — Am e perceba que a linha de baixo vai de Sol para Si para Lá, criando um movimento suave. Isso é mais interessante do que ir direto de G para Am.

### Meta mensurável
Você consegue tocar a progressão G — G/B — Am — Am/G — F — C sem perder o baixo.

### Checklist
- [ ] Entendo que o mesmo acorde tem múltiplas formas no braço
- [ ] Sei o que "G/B" significa (G com Si no baixo)
- [ ] Consigo tocar a forma de barre a partir da 6ª corda
- [ ] Consigo tocar a forma de barre a partir da 5ª corda

---

## AULA 8.4 — Campo harmônico maior

### Objetivo principal
Entender o que é campo harmônico e como ele explica por que certos acordes "ficam bem" juntos.

### Explicação teórica

O campo harmônico é o conjunto de acordes formados a partir dos graus da escala maior.

Para a escala de Dó maior (C D E F G A B):

| Grau | Nome | Acorde |
|------|------|--------|
| I | Tônica | C7M |
| II | Supertônica | Dm7 |
| III | Mediante | Em7 |
| IV | Subdominante | F7M |
| V | Dominante | G7 |
| VI | Superdominante | Am7 |
| VII | Sensível | Bm7(b5) |

**Regra prática:**
- Graus I, IV, VI: acordes menores 7M e maior 7M — soam "em repouso"
- Grau V: acorde dominante (com b7) — cria tensão, quer resolver no I
- Grau VII: meio-diminuto — tensão, usado em passagens

**Por que "Pais e Filhos" funciona:**
A música está em Lá menor (relativo menor de Dó maior). Os acordes Am — G — F — Em pertencem todos ao mesmo campo harmônico. É por isso que soam coerentes juntos.

**Campo harmônico menor (natural):**

A escala menor natural de Lá (A B C D E F G):

| Grau | Acorde |
|------|--------|
| Im7 | Am7 |
| IIm7(b5) | Bm7(b5) |
| bIII7M | C7M |
| IVm7 | Dm7 |
| Vm7 | Em7 |
| bVI7M | F7M |
| bVII7 | G7 |

**Progressão frequente no rock brasileiro:**
Im — bVII — bVI — bVII → Am — G — F — G (Legião Urbana usa muito)

### Aplicação em músicas do repertório

| Música | Tonalidade | Progressão principal |
|--------|-----------|---------------------|
| Pais e Filhos | Am | Im — bVII — bVI — Vm |
| Tempo Perdido | Em | Im — bVI — bVII — bVII |
| Wish You Were Here | G | I — bVII — II — IV |
| Comfortably Numb | Bm | Im — bVII — bVI (verso) / I — bVII (refrão) |

### Meta mensurável
Dado o tom de uma música (ex.: "está em Lá menor"), você consegue identificar quais 7 acordes pertencem ao campo harmônico.

### Checklist
- [ ] Sei construir o campo harmônico maior de qualquer tonalidade
- [ ] Entendo por que o acorde do V grau "quer resolver" no I
- [ ] Reconheço a progressão Im-bVII-bVI em músicas que toco
- [ ] Consigo transpor um campo harmônico para outra tonalidade

---

## AULA 8.5 — Escalas diatônicas: maior e menor natural

### Objetivo principal
Entender as escalas maior e menor, suas fórmulas e digitações básicas no braço.

### Referência: Nelson Faria, Parte III — Escalas Diatônicas

### Explicação teórica

**Escala maior:**
Fórmula: 1-2-3-4-5-6-7

Intervalos: T T ST T T T ST
(T = tom, ST = semitom)

Exemplo em Dó: C D E F G A B

Aplicação: sobre os acordes do campo harmônico maior (I7M, IIm7, IIIm7, IV7M, V7, VIm7, VIIm7(b5)).

**Escala menor natural (modo eólio):**
Fórmula: 1-2-b3-4-5-b6-b7

Intervalos: T ST T T ST T T

Exemplo em Lá: A B C D E F G

Aplicação: sobre os acordes do campo harmônico menor (Im7, IIm7(b5), bIII7M, IVm7, Vm7, bVI7M, bVII7).

### Digitações básicas (5 posições no braço)

Nelson Faria apresenta 5 digitações para cada escala, cobrindo todo o braço. Para iniciantes, trabalhe a Posição 1 (mais próxima do corpo do instrumento para cada tonalidade):

**Posição 1 da escala de Lá menor natural (a partir da 5ª corda, casa 5):**

```
E |--5--7--|
B |--5--7--|
G |--4--5--7--|
D |--5--7--|
A |--5--7--|
E |--5--7--|
```

*(Posições exatas variam conforme digitação do Nelson Faria — consulte o livro p.53)*

**Escala menor harmônica:**
Fórmula: 1-2-b3-4-5-b6-7

Diferença da natural: sétima maior (7) em vez de b7.
Isso cria um intervalo de tom e meio (3 semitons) entre o b6 e o 7, o que dá o som característico "árabe" ou "flamenco".

Aplicação: sobre Im7M, V7 (resolução mais tensa).

### Por que a escala pentatônica é tão usada no rock

A escala pentatônica menor é a escala menor natural sem os graus b2 e b6:
Fórmula: 1-b3-4-5-b7 (5 notas apenas)

Por ter 5 notas (em vez de 7), ela evita naturalmente as notas de "atrito" com os acordes de rock. É o ponto de partida para improvisar sobre praticamente qualquer música de rock ou blues.

**Pentatônica de Lá menor (posição 1 — a mais comum no rock):**

```
E |--5--8--|
B |--5--8--|
G |--5--7--|
D |--5--7--|
A |--5--7--|
E |--5--8--|
```

*(Posição 1, caixa básica — consulte Nelson Faria p.56 para todas as 5 posições)*

### Aplicação imediata

A maioria dos solos de rock usa a pentatônica menor sobre a tonalidade da música:
- Solo de "Comfortably Numb" — Gilmour usa pentatônica de Si menor
- Riffs de "Alive" — pentatônica de Lá
- Improvisação sobre "Black" — pentatônica de Lá

### Meta mensurável
Você toca a pentatônica menor na posição 1 em Am sem olhar para as mãos, no metrônomo a 80 BPM, de forma limpa.

### Checklist
- [ ] Sei diferenciar escala maior de menor pela fórmula
- [ ] Entendo por que a menor harmônica tem o som que tem
- [ ] Toco a pentatônica menor de Am na posição 1 limpa
- [ ] Sei em qual tonalidade estão as músicas do meu repertório

---

## AULA 8.6 — Modos gregos: o mapa completo

### Objetivo principal
Entender o que são modos, como se relacionam com a escala maior e quando cada um é aplicado.

### Referência: Nelson Faria, Parte IV — Modos

### Explicação teórica

Os modos gregos são 7 escalas derivadas da mesma escala maior, começando em cada um dos seus graus.

Nelson Faria os classifica em dois grupos:

**Modos maiores (têm terça maior):**
- Iônico (modo I): 1 2 3 4 5 6 7 — a própria escala maior, sem grau característico
- Lídio (modo IV): 1 2 3 #4 5 6 7 — grau característico: #4
- Mixolídio (modo V): 1 2 3 4 5 6 b7 — grau característico: b7

**Modos menores (têm terça menor):**
- Eólio (modo VI): 1 2 b3 4 5 b6 b7 — a própria escala menor natural
- Dórico (modo II): 1 2 b3 4 5 6 b7 — grau característico: 6 (sexta maior)
- Frígio (modo III): 1 b2 b3 4 5 b6 b7 — grau característico: b2
- Lócrio (modo VII): 1 b2 b3 4 b5 b6 b7 — graus característicos: b5 e b2

**A lógica prática:**

Cada modo soa em cima de um tipo específico de acorde:

| Modo | Acorde correspondente | Grau no campo harmônico maior |
|------|----------------------|-------------------------------|
| Iônico | 7M | I |
| Dórico | m7 | II |
| Frígio | m7 | III |
| Lídio | 7M | IV |
| Mixolídio | 7 (dominante) | V |
| Eólio | m7 | VI |
| Lócrio | m7(b5) | VII |

**Exemplos reais:**

O riff de "Comfortably Numb" (verse) está basicamente em Si mixolídio — que é a escala de Mi maior começando no Si.

A sonoridade "árabe" do metal progressivo vem frequentemente do modo frígio (b2 = segunda menor).

O som "aberto" e luminoso de certas músicas de MPB vem do modo lídio (#4).

### Aplicação para o repertório

| Música | Modo/Escala do improviso |
|--------|--------------------------|
| Blues rock (power chords) | Pentatônica menor ou blues menor |
| Pais e Filhos (verso) | Lá eólio (menor natural) |
| Solo de Wish You Were Here | Sol iônico / Mi pentatônica menor |
| Black (Pearl Jam) | Lá eólio / pentatônica menor |

### Nota sobre os modos da menor melódica e harmônica

Nelson Faria cobre os modos gerados pelas escalas menor melódica (7 modos) e menor harmônica (4 dos mais usados). Esses são conteúdo avançado para depois que os modos gregos estiverem sólidos. Entre os mais usados no rock:

- **Superlócrio (escala alterada):** sobre acorde dominante com tensões alteradas (b9, #9, b5, #5). Fórmula: 1-b2-#2-3-b5-#5-b7
- **Lídio b7:** sobre dominante com #11. Fórmula: 1-2-3-#4-5-6-b7

### Meta mensurável
Você consegue tocar o modo dórico de Ré (Dm7) e o modo mixolídio de Sol (G7) sem parar, encadeando os dois como uma progressão IIm7-V7.

### Checklist
- [ ] Sei nomear os 7 modos gregos e seus graus característicos
- [ ] Entendo que cada modo soa sobre um tipo de acorde específico
- [ ] Sei qual modo usar sobre um acorde dominante (V7)
- [ ] Toco o modo mixolídio na posição 1 de forma reconhecível

---

## AULA 8.7 — Arpejos: tocando as notas do acorde de forma melódica

### Objetivo principal
Entender o que é um arpejo, por que ele é a base do fraseado melódico e aprender as digitações básicas.

### Referência: Nelson Faria, Parte II — Arpejos

### Explicação teórica

Nelson Faria define: "Arpejo é a execução melódica das notas de um acorde."

Em vez de tocar as notas do acorde simultaneamente (como na palhetada), você as toca em sequência, como uma melodia.

**Por que arpejos são importantes:**
- Criam linhas melódicas que "contam" o acorde
- São a estrutura básica de qualquer improviso jazz-rock
- Permitem criar frases que fluem sobre progressões de acordes
- O solo de "Wish You Were Here" usa padrões de arpejo fingerpicking

### Tríades básicas em arpejos

**Tríade maior (1-3-5):**

Nelson Faria apresenta 5 digitações cobrindo todo o braço. Para iniciantes:

Posição 1 (com fundamental na 6ª corda):
```
Subindo:   6ª → 5ª → 4ª → 3ª → 2ª → 1ª
Nota:      1    5    1    3    5    1
```

**Tríade menor (1-b3-5):**

Mesmas posições, com a terça baixada um semitom.

### Tétrades (o arpejo dos acordes com sétima)

**Maior com sétima (7M): 1-3-5-7**
Usado sobre acordes 7M (I e IV do campo harmônico maior).

**Menor com sétima (m7): 1-b3-5-b7**
Usado sobre acordes m7 (II, III, VI do campo harmônico maior).

**Dominante (7): 1-3-5-b7**
Usado sobre acordes dominantes (V do campo harmônico).

### A técnica de superposição de arpejos (Nelson Faria)

Uma das ideias mais avançadas do livro: você pode tocar o arpejo de outro acorde SOBRE um acorde para gerar notas de tensão.

Exemplo dado por Nelson Faria:
C7M + arpejo de Bm7 = C7M com as tensões 9 e #11

Isso é o que permite a guitarristas de jazz criar melodias ricas sobre uma progressão simples.

Para iniciantes, não é necessário dominar isso agora. Mas é útil saber que a frase que Nelson Faria desenvolve na Parte V (fraseado sobre IIm7-V7-I7M) é construída exatamente assim.

### A progressão IIm7-V7-I7M

Nelson Faria usa Dm7-G7-C7M (em Dó) como base para demonstrar 20 frases melódicas diferentes na Parte V.

Essa progressão é a base de centenas de músicas de jazz, samba, MPB e rock suave. Em Lá menor:

```
Bm7(b5) — E7 — Am7
```

Em Ré maior:
```
Em7 — A7 — D7M
```

Cada uma das 20 frases do Nelson Faria mostra como usar arpejos, notas cromáticas e tensões para criar melodias sobre essa progressão.

### Meta mensurável
Você toca o arpejo de Am7 (subindo e descendo) na posição 1 de forma limpa e no tempo.

### Checklist
- [ ] Entendo que arpejo = notas do acorde tocadas em sequência
- [ ] Sei a diferença entre arpejo de tríade e de tétrade
- [ ] Toco o arpejo de Am7 limpo na posição 1
- [ ] Reconheço o uso de arpejos no fingerpicking de "Wish You Were Here"

---

## AULA 8.8 — Transposição e capotraste

### Objetivo principal
Aprender a transpor uma música para outro tom e usar o capotraste de forma inteligente.

### Explicação teórica

**Por que transpor:**
- A música está num tom que sua voz não alcança confortavelmente
- Você quer tocar com acordes abertos numa tonalidade que normalmente exigiria barres difíceis
- Você quer adaptar uma cifra para outra voz

**Como transpor:**

1. Identifique o tom da música (a nota "casa" para onde a música quer voltar)
2. Decida quantos semitons você quer subir ou descer
3. Suba ou desça todos os acordes na mesma proporção

**Exemplo:**
Música em Am, você quer tocar em Em (5 semitons abaixo):

| Original | Transposto (5ST abaixo) |
|----------|------------------------|
| Am | Em |
| G | D |
| F | C |
| Em | Bm |

**O capotraste:**

O capotraste é um dispositivo que você posiciona numa determinada casa para encurtar o braço da guitarra, efetivamente mudando a tonalidade sem precisar mudar a forma dos acordes.

| Capotraste na casa | Acorde "Am" aberto soa como |
|-------------------|----------------------------|
| 1 | A#m / Bbm |
| 2 | Bm |
| 3 | Cm |
| 4 | C#m / Dbm |
| 5 | Dm |

**Exemplo prático:**

"Wish You Were Here" (Pink Floyd): David Gilmour usa capotraste na casa 5 para tocar em Tom menor com formas de Gm.

Se a música está em Ré e você quer tocar com formas abertas de Lá, coloque o capo na casa 7 e toque como se fosse Am (o som real vai ser Dm).

**Cifra do Capo:**
Quando uma cifra diz "Capo 2", significa: coloque o capo na casa 2 e toque os acordes como escritos. O som real vai ser 2 semitons mais agudo.

### Exercício
Pegue "Pais e Filhos" (Am) e toque com capo na casa 3. Os acordes continuam sendo Am, G, F, Em para sua mão, mas o som real é Cm, Bb, Ab, Gm. Compare com a versão sem capo.

### Meta mensurável
Você consegue transpor qualquer progressão de 4 acordes para outro tom em menos de 2 minutos.

### Checklist
- [ ] Sei calcular a transposição por número de semitons
- [ ] Entendo o que o capotraste faz ao som da guitarra
- [ ] Usei o capo para tocar uma música em tonalidade diferente
- [ ] Sei que capo na casa X = subida de X semitons

---

## NOTAS PARA O PROFESSOR / IMPLEMENTAÇÃO

**Progressão de dificuldade:**
As aulas 8.1, 8.2 e 8.4 devem vir antes do Módulo 5 (poder chords, pestanas). As aulas 8.5, 8.6 e 8.7 devem vir depois do Módulo 6. A ordem no curso não precisa ser linear.

**Uso do livro de referência:**
O Nelson Faria é uma referência técnica densa. O material desta apostila simplifica e contextualiza os conceitos para o repertório do aluno. Quando o aluno quiser aprofundar, indique as páginas específicas do livro:
- Formação de acordes: pp. 13-16
- Acordes no braço: pp. 17-24
- Inversões: pp. 18-24
- Escalas diatônicas: pp. 53-54
- Pentatônicas: p. 56
- Blues: pp. 57-58
- Modos gregos: pp. 63-68
- Arpejos básicos: pp. 35-39
- Fraseado IIm7-V7-I7M: pp. 79-85

**Sobre os exercícios de arpejos (pp. 45-49):**
Os estudos 4.1 a 4.9 do Nelson Faria (arpejos sobre progressões em todas as tonalidades) são material de médio a longo prazo. Introduza gradualmente a partir do Módulo 7.

---

# GUITARRA E VOZ — Prompt para Claude Code
## Plataforma educacional de guitarra e canto

---

## CONTEXTO DO PROJETO

Construir uma plataforma educacional completa chamada **"Guitarra e Voz — Do Primeiro Acorde à Primeira Apresentação"**.

É um site de ensino de guitarra e canto com conteúdo estruturado em 9 módulos progressivos, fichas de músicas com cifras, diagramas de acordes gerados em SVG, padrões de batida, rotinas de prática e sistema de acompanhamento de evolução.

O projeto deve estar pronto para evoluir em versão paga futuramente. Por enquanto, sem autenticação e sem banco de dados — todo o conteúdo fica em arquivos JSON e MDX.

> **Decisão de 31/08/2026 (não estava no prompt original):** o projeto NÃO será um app Next.js
> separado. Ele será embutido dentro do repositório orium-site, sob a rota `/guitarra-voz`,
> como projeto pessoal independente da identidade visual ORIUM — mesmo padrão do
> `/colacao-de-grau` já documentado no CLAUDE.md deste repo. Todas as rotas do prompt original
> (`/`, `/modulos`, `/repertorio`, `/acordes`, `/pratica`, `/diagnostico`) devem ser lidas como
> `/guitarra-voz`, `/guitarra-voz/modulos`, etc. Componentes ficam em `components/guitarra-voz/`,
> conteúdo em `content/guitarra-voz/`, para não colidir com o namespace já usado pela ORIUM.

---

## STACK TÉCNICO

- **Framework:** Next.js 14 com App Router
- **Estilização:** Tailwind CSS (configuração customizada com tokens do projeto)
- **Conteúdo:** JSON para dados estruturados, MDX para aulas completas
- **Chord diagrams:** SVG gerado por componente React (sem biblioteca externa)
- **Fontes:** Google Fonts — Bebas Neue (display) + Inter (body)
- **Deploy target:** Vercel (domínio oriumagencia.com.br ou subdomínio)
- **Ícones:** Lucide React
- **Sem banco de dados na v1**
- **Sem autenticação na v1**

---

## DESIGN SYSTEM

### Paleta de cores

```css
--bg:       #0A0A0A   /* background principal */
--surface:  #131313   /* cards e painéis */
--surface2: #1C1C1C   /* hover states */
--red:      #C41A1A   /* acento primário */
--red-dim:  rgba(196,26,26,0.10)
--amber:    #CF6A0A   /* acento secundário (destaque, recomendado) */
--white:    #F0EBE3   /* texto principal */
--muted:    #676767   /* texto secundário */
--border:   rgba(240,235,227,0.07)
```

### Tipografia

```
Display: Bebas Neue — headings grandes, números de módulo, títulos de seção
Body: Inter — texto corrido, instruções, listas

Escala:
display:   clamp(2.75rem, 5.5vw, 4.5rem)  — Bebas Neue
heading:   clamp(1.5rem, 3vw, 2.25rem)    — Bebas Neue
body:      1rem / 1.65 line-height        — Inter 400
small:     0.8rem                          — Inter 400
label:     0.72rem / tracking 0.2em        — Inter 600 uppercase
```

### Princípios visuais

- Dark premium: sem gradientes decorativos, sem border-radius excessivo
- Grids com `gap: 1.5px` e fundo na cor da borda (cria separadores limpos sem border individual nos cards)
- Números de módulo grandes, em vermelho muito desbotado, posicionados atrás do conteúdo do card (position: absolute, opacity baixa)
- Hover nos cards: background sobe de --surface para --surface2, número fica um pouco mais visível
- Acento vermelho usado com restrição: CTAs, status crítico, numeração ativa
- Acento âmbar: itens recomendados, tempo de prática, sessão em destaque
- Nenhuma imagem de stock ou placeholder genérico — tudo SVG e CSS

---

## ESTRUTURA DE ARQUIVOS

```
guitarra-voz/
├── app/
│   ├── layout.tsx              — root layout, fonts, nav global
│   ├── page.tsx                — landing page (hero + overview)
│   ├── globals.css             — reset + CSS vars
│   │
│   ├── modulos/
│   │   ├── page.tsx            — lista de todos os 9 módulos
│   │   └── [numero]/
│   │       ├── page.tsx        — overview do módulo (tópicos, objetivos)
│   │       └── aula/
│   │           └── [slug]/
│   │               └── page.tsx — aula completa (20 elementos)
│   │
│   ├── repertorio/
│   │   ├── page.tsx            — lista de músicas por dificuldade
│   │   └── [slug]/
│   │       └── page.tsx        — ficha completa da música
│   │
│   ├── acordes/
│   │   └── page.tsx            — dicionário de acordes com diagramas SVG
│   │
│   ├── pratica/
│   │   └── page.tsx            — rotinas de prática (15/30/60 min)
│   │
│   └── diagnostico/
│       └── page.tsx            — quiz de diagnóstico inicial
│
├── components/
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── ChordDiagram.tsx        — SVG gerado por componente, dado: shape do acorde
│   ├── ChordDiagramGrid.tsx    — grid de acordes de uma música
│   ├── StruPattern.tsx         — representação visual de batida (down/up/muted)
│   ├── ProgressBadge.tsx       — Não dominado / Em desenvolvimento / Dominado
│   ├── ModuleCard.tsx
│   ├── SongCard.tsx
│   ├── LessonSection.tsx       — cada um dos 20 elementos de uma aula
│   ├── PracticeTimer.tsx       — cronômetro de sessão (opcional, v1)
│   └── DiagnosticQuiz.tsx
│
├── content/
│   ├── modulos.json            — dados dos 9 módulos
│   ├── musicas.json            — fichas de músicas (ver abaixo)
│   ├── acordes.json            — biblioteca de acordes (ver abaixo)
│   └── aulas/
│       ├── modulo-1-aula-1.mdx
│       ├── modulo-1-aula-2.mdx
│       └── ... (uma por aula)
│
├── lib/
│   ├── content.ts              — funções para ler JSON e MDX
│   └── chords.ts               — lógica do componente ChordDiagram
│
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## COMPONENTE ChordDiagram

Este é o componente mais importante do projeto. Gera um diagrama de acorde em SVG puro, sem biblioteca externa.

### Props

```typescript
interface ChordDiagramProps {
  name: string         // "Am", "G", "F#m"
  frets: number[]      // [x, 0, 2, 2, 1, 0] — x=-1 (mute), 0=open
  fingers: number[]    // [0, 0, 2, 3, 1, 0] — dedo 1-4, 0=nenhum
  barre?: {            // pestana opcional
    fret: number
    fromString: number
    toString: number
    finger: number
  }
  startFret?: number   // quando começa em frete mais alto
  size?: 'sm' | 'md' | 'lg'
}
```

### Lógica de renderização

```
- 6 cordas verticais (E A D G B e, da esquerda para direita)
- 5 casas horizontais
- Círculo vazio no topo = corda solta
- X no topo = corda abafada (não tocar)
- Círculo preenchido na casa = posição do dedo
- Número dentro do círculo = qual dedo (1=indicador, 2=médio, 3=anelar, 4=mínimo)
- Barra horizontal para pestana
- startFret > 1: mostrar número da casa no lado
```

### Tamanhos SVG

```
sm: 80x100px  — grade de acordes, referência rápida
md: 120x150px — card de música, fichas
lg: 160x200px — página de acordes, detalhe
```

---

## ESTRUTURA DE DADOS — musicas.json

```json
[
  {
    "slug": "pais-e-filhos",
    "nome": "Pais e Filhos",
    "artista": "Legião Urbana",
    "album": "As Quatro Estações",
    "ano": 1989,
    "dificuldade": "muito-facil",
    "modulo_recomendado": 1,
    "tonalidade_original": "Am",
    "tonalidade_sugerida": "Am",
    "capo": 0,
    "bpm_original": 90,
    "bpm_estudo": 65,
    "compasso": "4/4",
    "acordes": ["Am", "G", "F", "Em", "C", "E"],
    "habilidades": ["acordes abertos", "ritmo direto", "coordenação voz"],
    "dificuldade_vocal": "média",
    "dificuldade_guitarra": "fácil",
    "dificuldade_simultaneo": "média",
    "precisa_transpor": false,
    "estrutura": ["Intro", "Verso 1", "Refrão", "Verso 2", "Refrão", "Ponte", "Refrão", "Outro"],
    "padrao_batida": "D DU UDU",
    "padrao_batida_descricao": "↓ ↓↑ ↑↓↑ — batida básica de rock/pop em 4/4",
    "pontos_atencao": [
      "Troca de Am para G precisa ser fluida antes de adicionar canto",
      "Melodia vocal começa antes do tempo no verso",
      "F é o acorde mais difícil — pratique a troca Am>G>F separadamente"
    ],
    "estrategia_estudo": [
      "1. Aprenda Am, G, F, Em com diagrama",
      "2. Pratique as trocas sem ritmo, só movendo os dedos",
      "3. Adicione a batida básica sem cantar",
      "4. Fale a letra no ritmo enquanto toca",
      "5. Cante apenas o refrão",
      "6. Una guitarra e voz na música completa"
    ],
    "criterios_conclusao": [
      "Tocar a progressão completa sem parar por 2 minutos",
      "Trocar Am>G>F>Em em menos de 1 segundo cada",
      "Cantar o refrão afinado enquanto toca",
      "Executar a música completa do início ao fim"
    ],
    "fonte_tabs": "https://www.cifraclub.com.br/legiao-urbana/pais-e-filhos/",
    "youtube_referencia": "Pesquisar: 'Legião Urbana Pais e Filhos original'"
  }
]
```

> **Nota:** o prompt original trazia 12 músicas completas (Pais e Filhos, Have You Ever Seen the
> Rain, Garota Nacional, Tempo Perdido, Wish You Were Here, Primeiros Erros, Índios, Comfortably
> Numb, Black, Stairway to Heaven, Alive, Toda Forma de Amor) e uma biblioteca de 15 acordes —
> ambas serão migradas para `content/guitarra-voz/musicas.json` e `content/guitarra-voz/acordes.json`
> num plano de Fase 2. A versão completa está preservada apenas na mensagem original do usuário;
> se este arquivo precisar ser a única fonte, reconstituir a partir do histórico da sessão de
> 31/08/2026.

---

## PADRÕES DE BATIDA — conteúdo do componente StruPattern

```
Notação visual:
  ↓ = palhetada para baixo (downstroke)
  ↑ = palhetada para cima (upstroke)
  X = batida abafada (muted stroke)
  _ = silêncio (sem tocar)
  | = divisão de tempo

Padrão básico (usado em Pais e Filhos, Have You Ever Seen the Rain):
  Tempo:    1    +    2    +    3    +    4    +
  Batida:   ↓         ↓    ↑         ↑    ↓    ↑
  Nome: "D DU UDU" — Padrão básico de rock/pop

Padrão simples (iniciante):
  Tempo:    1    2    3    4
  Batida:   ↓    ↓    ↓    ↓
  Nome: "Só para baixo" — começar aqui

Padrão de balada:
  Tempo:    1    +    2    +    3    +    4    +
  Batida:   ↓    ↑    ↓    ↑    ↓    ↑    ↓    ↑
  Nome: "D U D U D U D U" — balada suave
```

---

## MÓDULOS — dados estruturados (resumo; os 9 completos, com tópicos/pré-requisito/conquista
## final, estão preservados na mensagem original do usuário — migrar para
## content/guitarra-voz/modulos.json na Fase 2)

1. Primeiros Contatos com a Guitarra
2. Ritmo e Coordenação
3. Fundamentos do Canto
4. Integração Guitarra e Voz
5. Guitarra de Acompanhamento
6. Desenvolvimento Vocal
7. Repertório Progressivo
8. Teoria Aplicada
9. Performance

---

## PÁGINAS A CONSTRUIR (rotas relativas a `/guitarra-voz`, ver decisão de embedding acima)

### 1. Landing Page (`/guitarra-voz`)

Seções em ordem vertical:
1. **Hero** — título grande, stats (24 semanas, 9 módulos, 5+ músicas), CTA para diagnóstico
2. **Sobre o curso** — o que você vai construir, 5 promessas
3. **Módulos** — grid 3x3 com todos os módulos (número grande desbotado, lista de tópicos)
4. **Estrutura das aulas** — grid dos 20 elementos de cada aula
5. **Rotinas de prática** — 3 colunas (15/30/60 min)
6. **Sistema de progressão** — 3 estados
7. **Repertório** — 4 colunas por dificuldade
8. **Avaliações** — timeline das 6 semanas
9. **Materiais** — grid dos 12 documentos
10. **CTA final** — diagnóstico

### 2. Módulos (`/guitarra-voz/modulos`)
### 3. Módulo individual (`/guitarra-voz/modulos/[numero]`)
### 4. Aula (`/guitarra-voz/modulos/[numero]/aula/[slug]`)

Estrutura de 20 elementos obrigatórios: Título e objetivo; O que você aprenderá; Por que isso
importa; Explicação teórica; Demonstração e exemplos; Aquecimento de guitarra; Aquecimento vocal;
Exercício técnico; Exercício de ritmo; Exercício de canto; Integração voz + guitarra; Aplicação em
uma música; Erros mais comuns; Como corrigir cada erro; Rotina de prática; Meta mensurável;
Checklist de conclusão; Teste final; O que gravar para avaliação; Próximo passo.

### 5. Repertório (`/guitarra-voz/repertorio`)
### 6. Ficha de música (`/guitarra-voz/repertorio/[slug]`)
### 7. Acordes (`/guitarra-voz/acordes`)
### 8. Prática (`/guitarra-voz/pratica`)
### 9. Diagnóstico (`/guitarra-voz/diagnostico`)

---

## FUNCIONALIDADES v1 (sem backend)

- Navegação entre todas as páginas
- Diagramas de acordes SVG gerados dinamicamente
- Visualização de padrões de batida
- Quiz de diagnóstico com resultado calculado no cliente
- Filtro de músicas por dificuldade
- Fichas completas de músicas
- Checklist local (localStorage para marcar tópicos como concluídos)
- Progresso por módulo salvo em localStorage

## FUNCIONALIDADES v2 (futuras, não implementar agora)

- Autenticação de usuários, progresso em banco de dados, upload de gravações, pagamento,
  dashboard de evolução, integração com metrônomo/afinador.

---

## ORDEM DE DESENVOLVIMENTO ORIGINAL (referência — replanejada por fase de execução real)

### Fase 1 — Estrutura e design system
1. Tailwind + tokens do projeto
2. globals.css com CSS vars
3. Nav, Footer, ProgressBadge
4. ChordDiagram (SVG)
5. StruPattern (batida)
6. Landing page com dados mockados

### Fase 2 — Conteúdo dinâmico
7. musicas.json completo
8. acordes.json completo
9. modulos.json completo
10. Página de módulos e módulo individual
11. Página de repertório e ficha de música
12. Página de acordes
13. Página de diagnóstico (quiz funcional)

### Fase 3 — Aulas e conteúdo completo
14. Primeiras 5 aulas em MDX (Módulo 1 completo)
15. Componente de aula com os 20 elementos
16. Checklist em localStorage
17. Progresso por módulo

### Fase 4 — Polish e deploy
18. SEO e metadata
19. Responsividade mobile completa
20. Deploy (dentro do deploy já existente do orium-site)

---

## OBSERVAÇÃO IMPORTANTE SOBRE CONTEÚDO

Não reproduzir tabs nota por nota de músicas comerciais diretamente no site. Conteúdo educacional
permitido: progressões de acordes, diagramas de acordes, estrutura das músicas, padrões de
batida, estratégias de estudo (conteúdo original). Tablatura nota por nota: linkar para Cifra Club
(licenciado) ou Ultimate Guitar.

---

# Teoria completa (JSON) — escalas, modos, campos harmônicos, arpejos

> Bloco de referência técnica adicional colado junto com o prompt do projeto, baseado no mesmo
> livro (Nelson Faria). Cobre: escalas diatônicas, pentatônicas, blues, simétricas; os 7 modos
> gregos; os modos da menor melódica e da menor harmônica; campos harmônicos maior/menor; arpejos
> básicos (tríades/tétrades); progressões comuns (IIm7-V7-I7M em várias tonalidades). Conteúdo
> integral preservado na mensagem original do usuário (31/08/2026) — usar como fonte quando as
> páginas `/guitarra-voz/acordes` e as aulas do Módulo 8 forem implementadas nas Fases 2 e 3, e
> migrar os dados para `content/guitarra-voz/teoria.json` nesse momento.
