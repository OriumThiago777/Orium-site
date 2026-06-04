// Fires after every git commit — injects a reminder to run /code-review
process.stdin.resume();
process.stdin.on('end', () => {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: 'Commit realizado. Sugira ao usuário executar /code-review para verificar qualidade do código antes do push para origin/main.',
    },
  }));
});
