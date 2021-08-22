const fs = require('fs')
const names = fs.readdirSync('.')
const dtss = names.filter(n => n.endsWith('.d.ts')).map(name => ({name, content: fs.readFileSync(name, 'utf8')}))
const apis = dtss.filter(dts => dts.content.includes('type: api'))
const records = dtss.filter(dts => dts.content.includes('type: adb-record'))
fs.writeFileSync('README.md', `# Atek Schemas

This is a working directory of the Atek project's core schemas.

## APIs

${apis.map(file => `### ${getTitle(file.content)}\n\n\`\`\`typescript\n${file.content}\n\`\`\`\n\n`).join('')}

## DB Tables

${records.map(file => `### ${getTitle(file.content)}\n\n\`\`\`typescript\n${file.content}\n\`\`\`\n\n`).join('')}
`)

function getTitle (content) {
  return /^title\:(.*)$/im.exec(content)[1].trim()
}