const fs = require('fs')
const names = fs.readdirSync('.')
const dts = names.filter(n => n.endsWith('.d.ts')).map(name => ({name, content: fs.readFileSync(name, 'utf8')}))
fs.writeFileSync('README.md', `# Atek Schemas

This is a working directory of the Atek project's core schemas.

${dts.map(file => `## ${file.name}\n\n\`\`\`typescript\n${file.content}\n\`\`\`\n\n`).join('')}
`)