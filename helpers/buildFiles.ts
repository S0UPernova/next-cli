import config from './getConfig'
import { program } from 'commander'
import * as starterTemplates from '../templates/templateIndex'
import { isNamedImports } from 'typescript'
interface builtFiles {
  component: string
  styles: string
  test: string
}
export default async function buildFiles({ fullPath, nameForStyleAndTest, pageName, componentName }: any): Promise<builtFiles> {
  const options = program.opts()
  let template: any = { component: "", styles: "", test: "" }
    if (options.template !== undefined && options.template.length > 0) {
      // This seems pretty hacky, but it seems to allow the behavior I am looking for
      template = starterTemplates?.[options.template as keyof typeof isNamedImports]
      template = await template({fullPath: fullPath, nameForStyleAndTest: nameForStyleAndTest, pageName: pageName, componentName: componentName})
    }
    else {
      template = await starterTemplates.defaultTemplate({fullPath: fullPath, nameForStyleAndTest: nameForStyleAndTest, pageName: pageName, componentName: componentName})
    }
    return { component: template.component, styles: template.styles, test: template.test }
}