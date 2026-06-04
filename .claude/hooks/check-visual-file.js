// Fires before any Write|Edit — injects CLAUDE.md visual rules when editing page.tsx or layout.tsx
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  try {
    const d = JSON.parse(Buffer.concat(chunks).toString());
    const fp = (d.tool_input && (d.tool_input.file_path || d.tool_input.filePath)) || '';
    if (/page\.tsx$/.test(fp) || /layout\.tsx$/.test(fp)) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          additionalContext:
            'CLAUDE.md — padrão visual OBRIGATÓRIO para este arquivo:\n' +
            '• Fundo: #080808 + hero.jpg (opacity 0.07) + gradiente radial laranja 5%\n' +
            '• Cores: laranja primário #FF6B00, sem classes Tailwind — inline styles\n' +
            '• Fontes: Anton (títulos e botões), Poppins (corpo)\n' +
            '• Inputs: rgba(255,255,255,0.04), border #1e1e1e, focus #FF6B00, borderRadius 10px\n' +
            '• Botão primário: background #FF6B00, fontFamily Anton, letterSpacing, boxShadow laranja\n' +
            '• Botão secundário: border #1e1e1e, sem fundo\n' +
            '• REFERÊNCIA ABSOLUTA: app/briefing/page.tsx — nunca quebrar sem aprovação explícita do Thiago',
        },
      }));
    }
  } catch (e) {}
});
