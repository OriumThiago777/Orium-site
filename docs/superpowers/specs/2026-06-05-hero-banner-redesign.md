# Hero Banner Redesign — Spec

**Data:** 2026-06-05  
**Arquivo alvo:** `app/page.tsx`

## O que muda

O hero da página pública (`<main id="inicio">`) passa de `h-screen` (100vh) para `75vh`, com dois overlays de gradiente sobrepostos para profundidade visual.

## Implementação

**1. Altura**
```
className: "relative w-full overflow-hidden"
style: height: 75vh
```

**2. Overlay principal — gradiente esquerda → direita**
```
background: linear-gradient(to right,
  rgba(8,8,8,0.93)  0%,
  rgba(8,8,8,0.70) 40%,
  rgba(8,8,8,0.20) 65%,
  transparent      100%
)
```

**3. Overlay secundário — vinheta inferior**
```
background: linear-gradient(to top,
  rgba(8,8,8,0.55)  0%,
  transparent      40%
)
```

**4. Conteúdo**  
`h-full flex items-center` com `pt-20` para navbar. Sem outras mudanças.

## O que NÃO muda
- Texto, botões, links
- Restante da página (`<StatsStrip>`, seções, footer)
- Rotas, variáveis, nomes de arquivo
