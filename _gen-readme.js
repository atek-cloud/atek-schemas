import { parse } from "https://deno.land/std@0.104.0/encoding/yaml.ts"

const schemas = []
for (const entry of Deno.readDirSync('.')) {
  if (!entry.name.endsWith('.yaml')) continue
  const text = Deno.readTextFileSync(entry.name)
  schemas.push(parse(text))
}

console.log(`# Austin Schemas

This is a working directory of the Austin project's core schemas. Everything is subject to change.

## Database Records

${schemas.filter(s => s.type === 'adb-record').map(s => `- ${s.title}: ${s.description}`).join('\n')}

## APIs

${schemas.filter(s => s.type === 'api').map(genApi).join('\n')}
`)

function genApi (s) {
  const lines = []
  lines.push(`- ${s.title}`)
  for (let k in s.definition.methods) {
    const m = s.definition.methods[k]
    const params = Array.isArray(m.params) ? m.params : m.params?.items ? m.params.items : []
    const paramsStr = params.map(p => p.name).join(', ')
    const res = m.response ? m.response.type : 'void'
    lines.push(`  - \`${k}(${paramsStr}): Promise<${res}>\``)
    lines.push(`    - ${s.definition.methods[k].description}`)
  }
  return lines.join('\n')
}
