import chalk from 'chalk'
import fs from 'fs'
import config from '../getConfig'
export default function generate(gen: string, name: string) {
  const nameArr = name.split('/')
  let pageName = nameArr[nameArr.length - 1]
  if (!gen || !pageName) {
    console.log("missing param/s")
    return
  }
  const path = require('node:path')
  config.then((data) => {
    const pageRoute: string = data?.pageRoute ? data.pageRoute : './src/pages' // todo use conf to set this.
    const styleRoute: string = data?.styleRoute ? data.styleRoute : './src/styles' // todo use conf to set this.
    const testRoute: string = data?.testRoute ? data.testRoute : './src/test'
    const pageFileExtension: string = data?.pageFileExtension ? data.pageFileExtension : '.jsx' // todo use conf to set this.
    const testFileExtension: string = data?.testFileExtension ? data.testFileExtension : '.js'
    const styleFileExtension: string = data?.styleFileExtension ? data.styleFileExtension : '.css'

    // create component
    const component =
      `import styles from '${path.relative(path.join(pageRoute, nameArr.slice(0, nameArr.length - 1).join("/")), path.join(styleRoute, nameArr.join('_') + ".module" + styleFileExtension))}'\n`
      + `export default function ${pageName.slice(0, 1).toUpperCase() + pageName.slice(1)}() {\n`
      + `  return <div data-testid="div" className={styles.hello}>Hello my name is ${pageName}</div>\n`
      + `}`

      //todo maybe add subroutes for test/integration, and such
    // create a test for the component
    const test =
      `import ${pageName?.slice(0, 1).toUpperCase() + pageName.slice(1)} from '${path.relative(path.join(testRoute), path.join(pageRoute, nameArr.slice(0, nameArr.length - 1).join("/")))}'\n`
      + `import { render } from "@testing-library/react"\n`
      + `function renderPage() {\n`
      + `  return render(${pageName.slice(0, 1).toUpperCase() + pageName.slice(1)}())\n`
      + `}\n`
      + `describe("<${pageName.slice(0, 1).toUpperCase() + pageName.slice(1)} />", () => {\n`
      + `  test("should display the starter div", async () => {\n`
      + `    const {findByTestId} = renderPage()\n`
      + `    const page = await findByTestId("div")\n`
      + `    expect(page.innerHTML).toEqual("Hello my name is ${pageName}")\n`
      + `  })\n`
      + `})`

    // create style for component
    const style =
      `.hello {`
      + `  color: green;`
      + `}`

    switch (gen) {
      //? maybe have it make index pages for each empty dir it creates
      case "page":

        //* Creates the directories to get to the final file location (unless they already exist)
        fs.promises.mkdir(`src/pages/${nameArr.slice(0, nameArr.length - 1).join('/')}`, { recursive: true })
          .then(() => {
            // todo get this to only fire on once that didn't exist before
            // nameArr.forEach((dir: string, i: number) => {
            //   if (i < nameArr.length - 1)
            //     console.log(chalk.green.bold(`Created-dir: ${pageRoute}${nameArr.slice(0, i + 1).join('/')}`))
            // })

            //* Creates page file
            fs.promises.writeFile(`${path.join(pageRoute, nameArr.join('/') + pageFileExtension)}`, component)
              .then(() => {
                console.log(chalk.green.bold(`Created-file: ${pageRoute}/${nameArr.join('/')}${pageFileExtension}`))
              })
              .then(() => {

                //* Creates style module file
                fs.promises.writeFile(`${path.join(styleRoute, nameArr.join('_') + ".module" + styleFileExtension)}`, style)
                  .then(() => {
                    console.log(chalk.green.bold(`Created-file: ${styleRoute}/${nameArr.join('_')}.module${styleFileExtension}`))
                  })
                  .then(() => {

                    //* Creates test for page
                    fs.promises.mkdir(testRoute, { recursive: true })
                      .then(() => {
                        fs.promises.writeFile(path.join(testRoute,  nameArr.join('_') + ".spec" + testFileExtension),
                          test
                        ).then(() => {
                          console.log(chalk.green.bold(`Created-file: ${testRoute}/${nameArr.join('/')}.spec${testFileExtension}`))
                        })
                      })
                  })
              })
          })
          .catch((err: any) => {
            console.error(err)
          })
        break
    }
  })
    .catch((err: any) => console.log("please run $ nx --init, or create nx.config.json in your projects root directory"))
}