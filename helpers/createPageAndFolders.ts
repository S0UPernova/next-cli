import generateScaffold from './generateScaffold'
import * as temps from '../templates/templateIndex'
import chalk from 'chalk'
import fs from 'fs'
import config from '../helpers/getConfig'
import { program } from 'commander'
import { json } from 'stream/consumers'
export default function createPageAndFolders(name: string, scaffold: any): any {
  const options = program.opts()
  const path = require('node:path')
  const nameArr: string[] = name.split('/')
  let pageName: string = nameArr[nameArr.length - 1].split('').filter(s => s !== "[" && s !== "]").join("") // todo get this to work with something like blog/[blogId] or blog/[blog_id] blog/[blog-id] maybe require specific separators - or _ 
  const componentName: string = pageName.split(/[-_]/)[0].slice(0, 1).toUpperCase() + pageName.slice(1)
  config.then(async (data) => {
    const pageRoute: string = data?.pageRoute ? data.pageRoute : './src/pages'
    const styleRoute: string = data?.styleRoute ? data.styleRoute : './src/styles'
    const testRoute: string = data?.testRoute ? data.testRoute : './src/test'
    const pageFileExtension: string = data?.pageFileExtension ? data.pageFileExtension : '.jsx'
    const testFileExtension: string = data?.testFileExtension ? data.testFileExtension : '.js'
    const styleFileExtension: string = data?.styleFileExtension ? data.styleFileExtension : '.css'
    const usingTypeScript: boolean = data?.pageFileExtension === ".ts" || data?.pageFileExtension ===  ".tsx"


    interface functions { //todo abstract the these to use multiple places
      n: string // name of the function
      a?: string[] | string // arguments for the function
    }
    type handlers = string
    "ocl" ||  // onClick
      "och" // onChange

    interface element {
      t?: string // html tag
      h?: handlers | Array<handlers> // handleClick and such //todo make this an array 
      c?: string // inner content -- will appear above the children
      cl?: string[] | string // classname
      ch?: element[] // child elements
    }
    interface component {
      f?: Array<functions> // functions for the component
      r?: Array<element>
    }
    let template
    let temp: component | undefined = undefined
    let componentTemplate: string | undefined
    let styleTemplate: string | undefined
    let testTemplate: string | undefined
    if (options.template) {
      switch (options.template) {
        case "first":
          temp = temps.firstTemplate // sigh
          break
      }
      if (temp !== undefined) {
        template = generateScaffold(temp, usingTypeScript)
        // componentTemplate = template.component
        // styleTemplate = template.styles
        // testTemplate = template.test
        // console.log(chalk.green('component: ', generateScaffold(temp).component))
        // console.log(chalk.yellow('test: ', generateScaffold(temp).test))
        // console.log(chalk.blue('styles: ', generateScaffold(temp).styles))
      }
    } else if (scaffold) {
      const scaf = JSON.parse(scaffold)
      template = generateScaffold(scaf, usingTypeScript)

      // console.log(chalk.green('component: ', generateScaffold(scaf).component))
      // console.log(chalk.yellow('test: ', generateScaffold(scaf).test))
      // console.log(chalk.blue('styles: ', generateScaffold(scaf).styles))
    }
    if (template) {
      componentTemplate = template.component
      styleTemplate = template.styles
      testTemplate = template.test
    }
    // console.log('component', chalk.green(template?.component))
    // console.log('styles', chalk.blue(template?.styles))
    // console.log('test', chalk.yellow(template?.test))

    // create component
    const imp = !options.skip_style ? `import styles from '${path.relative(
      path.join(pageRoute, name.split('').filter(s => s !== "[" && s !== "]").join("").split("/").slice(0, nameArr.length - 1).join("/")),
      path.join(styleRoute, nameArr.slice().join("_").split('').filter(s => s !== "[" && s !== "]").join("").split("/").slice(0, nameArr.length - 1) + ".module" + styleFileExtension)
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
      `import ${componentName} from '${path.relative(path.join(testRoute), path.join(pageRoute, nameArr.join("/")))}'\n`
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

    if (!options.skip_page) {
      //* Creates the directories to get to the final file location (unless they already exist)
      await fs.promises.mkdir(`${path.join(pageRoute, nameArr.slice(0, nameArr.length - 1).join('/'))}`, { recursive: true })
        .then(() => {
          //* Creates page file
          fs.promises.writeFile(`${path.join(pageRoute, nameArr.join('/') + pageFileExtension)}`, component)
            .then(() => {
              console.log(chalk.green.bold(`Created-file: ${pageRoute}/${nameArr.join('/')}${pageFileExtension}`))
            })
        })
    }


    if (!options.skip_style) {
      //* Creates style module file
      await fs.promises.writeFile(`${path.join(styleRoute, nameArr.slice().join("_").split('').filter(s => s !== "[" && s !== "]").join("").split("/").slice(0) + ".module" + styleFileExtension)}`, style)
        .then(() => {
          console.log(chalk.green.bold(`Created-file: ${styleRoute}/${nameArr.slice().join("_").split('').filter(s => s !== "[" && s !== "]").join("").split("/").slice(0)}.module${styleFileExtension}`))
        })
        .catch((err: any) => {
          console.error(err)
        })
    }

    if (!options.skip_test) {
      //* Creates the directories to get to the final file location (unless they already exist)
      await fs.promises.mkdir(testRoute, { recursive: true })
        .then(() => {
          //* Creates test for page
          fs.promises.writeFile(path.join(testRoute, nameArr.slice().join("_").split('').filter(s => s !== "[" && s !== "]").join("").split("/").slice(0) + ".spec" + testFileExtension),
            test
          ).then(() => {
            console.log(chalk.green.bold(`Created-file: ${testRoute}/${nameArr.slice().join("_").split('').filter(s => s !== "[" && s !== "]").join("").split("/").slice(0)}.spec${testFileExtension}`))
          })
        })
    }
  })
    .catch((err: any) => console.log("please run $ nx --init, or create nx.config.json in your projects root directory"))
}