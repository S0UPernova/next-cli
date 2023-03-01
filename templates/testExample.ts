import { program } from 'commander'
const path = require('node:path')

import config from '../helpers/getConfig'
import indent from '../helpers/indent'

interface builtFiles {
  component: string
  styles: string
  test: string
}

export default function testExample({ fullPath, nameForStyleAndTest, pageName, componentName }: any): Promise<builtFiles> {
  return config.then(async (conf: any) => {
    const options = program.opts()
    const usingTypeScript: boolean = conf.pageFileExtension === ".ts" || conf.pageFileExtension === ".tsx"
    const imp = !options.skip_style ? `import styles from '${path.relative(
      path.join(conf.pageRoute, fullPath.split("/").slice(0, fullPath.split("/").length - 1).join("/")),
      path.join(conf.styleRoute, nameForStyleAndTest + ".module" + conf.styleFileExtension)
    )}'\n` : ""
    const component = imp + `export default function ${componentName}() {\n`
      + `${indent(1)}return <div data-testid="div" className={styles.hello}>Hello my name is ${pageName}</div>\n`
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
      + `//${indent(2)}const element = await findByTestId("data-testid")\n`
      + `//${indent(2)}expect(element.innerHTML).toEqual("content")\n`
      + `//${indent(1)}})\n`
      + `})`
      :
      `import ${componentName} from '${path.relative(path.join(conf.testRoute), path.join(conf.pageRoute, fullPath))}'\n`
      + `import { render } from "@testing-library/react"\n`
      + `function renderPage() {\n`
      + `${indent(1)}return render(${componentName}())\n`
      + `}\n`
      + `describe("<${componentName} />", () => {\n`
      + `${indent(1)}test("should display the starter div", async () => {\n`
      + `${indent(2)}const {findByTestId} = renderPage()\n`
      + `${indent(2)}const page = await findByTestId("div")\n`
      + `${indent(2)}expect(page.innerHTML).toEqual("Hello my name is ${pageName}")\n`
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