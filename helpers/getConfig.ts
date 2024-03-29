import fs from 'fs'
import path from 'node:path'
// todo add color scheme to config
// todo add spaces per indent level to config
interface data {
  "pageRoute"?: string
  "styleRoute"?: string
  "testRoute"?: string
  "pageFileExtension"?: string
  "testFileExtension"?: string
  "styleFileExtension"?: string
  "usingAppDir"?: boolean
  "usingSrcDir"?: boolean
}
const config = fs.promises.readFile(path.join(process.cwd(), 'nx.config.json'), 'utf-8').then((data): data => {
  return JSON.parse(data)
})

export default config