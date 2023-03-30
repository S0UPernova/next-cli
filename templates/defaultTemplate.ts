import { program } from 'commander'
const path = require('node:path')

import config from '../helpers/getConfig'
import indent from '../helpers/indent'
import paths from '../helpers/getPaths'
import getPaths from '../helpers/getPaths'
import getNames from '../helpers/getNames'
interface builtFiles {
  component: string
  styles: string
  test: string
}

// todo abstract the path to a function like the names
export default function defaultTemplate({ fullPath }: any): Promise<builtFiles> {
  return config.then(async (conf: any) => {
    const paths = await getPaths(fullPath),
      names = getNames(fullPath),
      options = program.opts()

    // const usingTypeScript: boolean = conf.pageFileExtension === ".ts" || conf.pageFileExtension === ".tsx"
    const imp = !options.skip_style ? `import styles from '${paths.styleImportPath}'\n` : ""
    const component = "// this is the default\n" + imp + `export default function ${names.componentName}() {\n`
      + `${indent(1)}return <div data-testid="div" className={styles.hello}>Hello my name is ${names.pageName}</div>\n`
      + `}`

    // create a test for the component
    const test = options.skip_page ?
      `import { render } from "@testing-library/react"\n`
      + `//function renderPage() {\n`
      + `//${indent(1)}return render(componentName())\n`
      + `//}\n`
      + `describe("<componentName />", () => {\n`
      + `//${indent(1)}test("should display the content from element", async () => {\n`
      + `//${indent(2)}const {findByTestId} = renderPage()\n`
      + `//${indent(2)}const element = await findByTestId("") // data-testid\n`
      + `//${indent(2)}expect(element.innerHTML).toEqual("content")\n`
      + `//${indent(1)}})\n`
      + `})`
      :
      `import ${names.componentName} from '${paths.componentImport}'\n`
      + `import { render } from "@testing-library/react"\n`
      + `function renderPage() {\n`
      + `${indent(1)}return render(${names.componentName}())\n`
      + `}\n`
      + `describe("<${names.componentName} />", () => {\n`
      + `${indent(1)}test("should display the starter div", async () => {\n`
      + `${indent(2)}const {findByTestId} = renderPage()\n`
      + `${indent(2)}const page = await findByTestId("div")\n`
      + `${indent(2)}expect(page.innerHTML).toEqual("Hello my name is ${names.pageName}")\n`
      + `${indent(1)}})\n`
      + `})`


    // create style for component
    const style = `.hello {`
      + `${indent(1)}color: green;`
      + `}`

    return {
      component: component,
      styles: style,
      test: test,
    }
  })
}