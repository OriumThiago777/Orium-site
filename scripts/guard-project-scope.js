#!/usr/bin/env node
const path = require('path');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  let data;
  try {
    data = JSON.parse(input);
  } catch (e) {
    process.exit(0);
  }

  const projectRoot = path.resolve(__dirname, '..');
  const toolName = data.tool_name || '';
  const toolInput = data.tool_input || {};

  function isOutsideProject(candidate) {
    if (!candidate) return false;
    const resolved = path.resolve(projectRoot, candidate);
    const rel = path.relative(projectRoot, resolved);
    return rel.startsWith('..') || path.isAbsolute(rel);
  }

  if (['Read', 'Edit', 'Write', 'NotebookEdit'].includes(toolName)) {
    const filePath = toolInput.file_path;
    if (isOutsideProject(filePath)) {
      console.error(`Bloqueado: ${filePath} fica fora do projeto orium-site. Se precisar de algo de outro projeto, pare e pergunte ao usuário em vez de acessar direto.`);
      process.exit(2);
    }
  }

  if (['Grep', 'Glob'].includes(toolName)) {
    const searchPath = toolInput.path;
    if (isOutsideProject(searchPath)) {
      console.error(`Bloqueado: busca aponta para fora do projeto orium-site (${searchPath}). Pare e pergunte ao usuário.`);
      process.exit(2);
    }
  }

  if (['Bash', 'PowerShell'].includes(toolName)) {
    const command = toolInput.command || '';
    const blockedPatterns = /orium-fiscal|cortex-hub-site|\.\.[\\/]\.\.[\\/]/i;
    if (blockedPatterns.test(command)) {
      console.error('Bloqueado: comando referencia outro projeto ORIUM ou sobe mais de um nível de diretório. Pare e pergunte ao usuário antes de continuar.');
      process.exit(2);
    }
  }

  process.exit(0);
});
