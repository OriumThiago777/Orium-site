---
name: visual-polish
description: "Apply ORIUM™ visual identity and premium polish to any interface in this project. Use when reviewing, fixing, improving, or building any page, component, card, button, modal, sidebar, form, or PDF in the orium-site project. Triggers on: 'polish', 'visual', 'refine', 'improve the UI', 'it looks off', 'something is wrong visually', 'make it premium', 'apply ORIUM style', 'doesn't match the design', or any task that involves changing how something looks in this codebase. Also use proactively when building new tools or pages — never deliver a new interface without checking it against this skill first."
---

# Visual Polish — ORIUM™

This skill defines the visual identity of ORIUM™ and guides its precise application across all internal tools and the public site. The goal is consistency, restraint, and premium feel — every pixel should feel intentional.

## Identity at a Glance

| Token | Value | Use |
|-------|-------|-----|
| Background | `#080808` | Base of every screen |
| Orange | `#FF6B00` | Primary action, focus, accent |
| White | `#FFFFFF` | Text, icons, borders (with opacity) |
| Surface | `rgba(255,255,255,0.04)` | Cards, inputs, subtle elevations |
| Border | `#1e1e1e` | Default border; `#141414` for sidebar/footer |
| Font — Display | Anton | Headings, buttons, hero text, labels with weight |
| Font — Body | Poppins | All body copy, inputs, secondary text |

The aesthetic is **editorial dark** — think a high-end agency portfolio, not a SaaS dashboard. Restraint is the rule. When in doubt, less is more.

## Layout System

Every tool follows this structure:

```
position: fixed; inset: 0; overflow: hidden;
├── Sidebar (260px expanded / 60px collapsed)
│   border-right: 1px solid #141414
│   backdrop-filter: blur(12px)
│   toggle button: ←/→, always visible
│   "← menu" link → /hub
├── Main Content (flex-1, overflow-y-auto)
│   background: #080808
│   + hero.jpg at opacity 0.07 (background-image, full cover)
│   + radial gradient: orange at ~5% opacity, centered
└── Footer (fixed bottom)
    background: rgba(8,8,8,0.9)
    backdrop-filter: blur(8px)
    border-top: 1px solid #141414
```

The reference implementation is `app/briefing/page.tsx`. Read it before modifying any tool's layout — it is the source of truth.

## Component Patterns

### Inputs
```css
background: rgba(255,255,255,0.04)
border: 1px solid #1e1e1e
border-radius: 10px
focus: border-color #FF6B00, outline: none
color: white
font-family: Poppins
```
Never use solid white or gray backgrounds for inputs — it breaks the dark theme.

### Primary Button
```css
background: #FF6B00
font-family: Anton
letter-spacing: 0.05em
box-shadow: 0 0 20px rgba(255,107,0,0.3)
border-radius: 8px
color: white
```
On hover, increase box-shadow intensity. Never use purple, blue, or generic color.

### Secondary Button
```css
background: transparent
border: 1px solid #1e1e1e
color: rgba(255,255,255,0.7)
font-family: Poppins
border-radius: 8px
```
On hover: border shifts to `#FF6B00` or opacity increases.

### Cards
```css
background: rgba(255,255,255,0.03)
border: 1px solid #1e1e1e
border-radius: 12px
padding: 20–24px
```
On hover (interactive cards): `border-color: rgba(255,107,0,0.4)` + subtle shadow.

### Badges / Tags
Small, uppercase, Anton or Poppins semibold. Orange for active/primary states. Muted white (`rgba(255,255,255,0.5)`) for neutral. Never use colorful multi-hue badges — stay monochrome + orange.

## Typography Rules

- **Headings**: Anton, uppercase or title-case, tight letter-spacing (`0.02–0.05em`)
- **Body**: Poppins 14–16px, weight 300–400, line-height 1.6
- **Labels**: Poppins 11–12px, uppercase, `rgba(255,255,255,0.5)`, letter-spacing `0.08em`
- **Hero text**: Anton, large (48–96px depending on context), white or orange

Never use Inter, Roboto, Arial, or system fonts. Never mix more than these two typefaces.

## Orange Usage

Orange is the most powerful element in the palette — use it sparingly so it retains impact:

✅ Use orange for: primary CTA buttons, active nav links, input focus rings, progress bars, key metrics, the logo mark  
❌ Do not use orange for: body text, decorative backgrounds, multiple competing elements on the same screen, borders unless it's a focus/active state

One dominant orange element per view. Two is the maximum. Three is always too many.

## Glassmorphism (when applied)

When using glass-style surfaces (modals, overlays, floating panels):
```css
background: rgba(8,8,8,0.8)
backdrop-filter: blur(16px)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 16px
```
Avoid pure white glass — it clashes with the dark background.

## Common Polish Failures

These are the most frequent issues to catch and fix:

| Problem | Fix |
|---------|-----|
| Input background is white or light gray | → `rgba(255,255,255,0.04)` |
| Button uses generic color (blue, green, gray) | → `#FF6B00` primary or transparent secondary |
| Font is Inter, Roboto, or system | → Anton (headings) + Poppins (body) |
| Border is too bright (`#333`, `#444`) | → `#1e1e1e` or `#141414` |
| Hero image missing or not layered | → `hero.jpg` at `opacity: 0.07`, full cover |
| Orange used on 3+ elements per screen | → Reduce to 1–2 maximum |
| Text contrast too low (gray-on-dark) | → Minimum `rgba(255,255,255,0.7)` for secondary, `#fff` for primary |
| Layout scrolls the entire page | → `position: fixed; inset: 0; overflow: hidden` on root |
| Sidebar missing blur or collapse behavior | → Check `app/briefing/page.tsx` pattern |
| Footer not fixed or not blurred | → `position: fixed; bottom: 0; backdrop-filter: blur(8px)` |

## Pre-Delivery Checklist

Before declaring any UI work complete, verify:

- [ ] Background is `#080808` with `hero.jpg` at opacity 0.07
- [ ] Radial gradient (orange, ~5%) applied to background
- [ ] Fonts: Anton for headings/buttons, Poppins for body
- [ ] All inputs follow the dark glass pattern (no white backgrounds)
- [ ] Primary buttons: `#FF6B00` + Anton + orange glow
- [ ] Orange appears on 1–2 elements max per screen
- [ ] Borders: `#1e1e1e` default, `#141414` for sidebar/footer
- [ ] Sidebar has blur, collapse toggle, and /hub link
- [ ] Footer is fixed, blurred, and has top border
- [ ] Text contrast is sufficient (no gray-on-gray)
- [ ] No stray colors from other design systems
- [ ] Responsive on mobile (375px) and desktop (1440px)
- [ ] Layout uses `position: fixed; inset: 0; overflow: hidden`

## Public Site vs. Internal Tools

The public site (`app/page.tsx`) follows the same identity but allows more expressive hero layouts, full-width sections, and marketing copy patterns. Internal tools prioritize density, fixed layout, and sidebar navigation.

Both share: `#080808`, `#FF6B00`, Anton, Poppins, `hero.jpg`, the same button and input patterns.
