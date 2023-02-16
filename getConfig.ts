import fs from 'fs'
import path from 'node:path'
interface data {
  "pageRoute"?: string
  "styleRoute"?: string
  "testRoute"?: string
  "pageFileExtension"?: string
  "testFileExtension"?: string
  "styleFileExtension"?: string
}
const config = fs.promises.readFile(path.join(process.cwd(), 'nx.config.json'), 'utf-8').then((data): data => {
  return JSON.parse(data)
})

export default config