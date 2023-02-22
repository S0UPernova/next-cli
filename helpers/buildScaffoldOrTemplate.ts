import config from './getConfig'
const path = require('node:path')
import { program } from 'commander'
import * as starterTemplates from '../templates/templateIndex'
import generateScaffold from './generateScaffold'
import { isNamedImports } from 'typescript'
interface builtScaffold {
  component: string
  styles: string
  test: string
}

//  interface functions {
//   n: string // name of the function
//   a?: string[] | string // arguments for the function
// }
//  type handlers =  "ocl" |  "och"

//  interface element {
//   t?: string // html tag
//   h?: handlers | Array<handlers> // handleClick and such
//   c?: string // inner content -- will appear above the children
//   cl?: string[] | string // classname
//   ch?: element[] // child elements
// }
//  interface component {
//   f?: Array<functions> // functions for the component
//   r?: Array<element>
// }


export default function buildScaffoldOrTemplate({ name, scaffold, nameForStyleAndTest, pageName, componentName }: any): Promise<builtScaffold> {
  const options = program.opts()
  return config.then(async (conf) => {
    let template:  builtScaffold | undefined = undefined
    const usingTypeScript: boolean = conf.pageFileExtension === ".ts" || conf.pageFileExtension === ".tsx"
    if (options.template !== undefined && options.template.length > 0) {
          // This seems pretty hacky, but it seems to allow the behavior I am looking for
          template = generateScaffold(starterTemplates?.[options.template as keyof typeof isNamedImports], usingTypeScript) 
          if (template === undefined || !template.component) throw new Error(`Unable to find template "${options.template}"`)
    } 
    else if (scaffold) {
      const scaf = JSON.parse(scaffold)
      template = generateScaffold(scaf, usingTypeScript)
    }

    const imp = !options.skip_style ? `import styles from '${path.relative(
      path.join(conf.pageRoute, name.split("/").slice(0, name.split("/").length - 1).join("/")),
      path.join(conf.styleRoute, nameForStyleAndTest + ".module" + conf.styleFileExtension)
    )}'\n` : ""
    const component = imp + `export default function ${componentName}() {\n`
      + `${template?.component ? template.component : `  return <div data-testid="div" className={styles.hello}>Hello my name is ${pageName}</div>\n`}`
      + `}`

    // create a test for the component
    const test = options.skip_page ?
      `import { render } from "@testing-library/react"\n`
      + `//function renderPage() {\n`
      + `//  return render(componentName())\n`
      + `//}\n`
      + `describe("<componentName />", () => {\n`
      + `//  test("should display the content from element", async () => {\n`
      + `//    const {findByTestId} = renderPage()\n`
      + `//    const element = await findByTestId("data-testid")\n`
      + `//    expect(element.innerHTML).toEqual("content")\n`
      + `//  })\n`
      + `})`
      :
      `import ${componentName} from '${path.relative(path.join(conf.testRoute), path.join(conf.pageRoute, name))}'\n`
      + `import { render } from "@testing-library/react"\n`
      + `function renderPage() {\n`
      + `  return render(${componentName}())\n`
      + `}\n`
      + `${template?.test !== undefined ? template.test :
        `describe("<${componentName} />", () => {\n`
        + `  test("should display the starter div", async () => {\n`
        + `    const {findByTestId} = renderPage()\n`
        + `    const page = await findByTestId("div")\n`
        + `    expect(page.innerHTML).toEqual("Hello my name is ${pageName}")\n`
        + `  })\n`
        + `})`}`


    // create style for component
    const style = template?.styles ? template.styles :
      `.hello {`
      + `  color: green;`
      + `}`

    return { component: component, styles: style, test: test }
  })
}