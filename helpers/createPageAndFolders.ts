import chalk from 'chalk'
import fs from 'fs'
import config from '../helpers/getConfig'
import { program } from 'commander'
import buildScaffoldOrTemplate from './buildScaffoldOrTemplate'
export default function createPageAndFolders(name: string, scaffold: any): any {
  const options = program.opts()
  const path = require('node:path')
  const nameArr: string[] = name.split('/')
  const pageName: string = nameArr[nameArr.length - 1].split('').filter(s => s !== "[" && s !== "]").join("") // todo get this to work with something like blog/[blogId] or blog/[blog_id] blog/[blog-id] maybe require specific separators - or _ 
  const componentName: string = pageName.split(/[-_]/)[0].slice(0, 1).toUpperCase() + pageName.slice(1)
  const nameForStyleAndTest = name.replace(/\//g, "_").replace(/[\[\]]/g, "")
  config.then(async (data) => {
    const pageRoute: string = data?.pageRoute ? data.pageRoute : './src/pages'
    const styleRoute: string = data?.styleRoute ? data.styleRoute : './src/styles'
    const testRoute: string = data?.testRoute ? data.testRoute : './src/test'
    const pageFileExtension: string = data?.pageFileExtension ? data.pageFileExtension : '.jsx'
    const testFileExtension: string = data?.testFileExtension ? data.testFileExtension : '.js'
    const styleFileExtension: string = data?.styleFileExtension ? data.styleFileExtension : '.css'
    
    const constructedElements = await buildScaffoldOrTemplate({ name: name, scaffold: scaffold, nameForStyleAndTest: nameForStyleAndTest, pageName, componentName })

    if (!options.skip_page) {
      //* Creates the directories to get to the final file location (unless they already exist)
      await fs.promises.mkdir(`${path.join(pageRoute, nameArr.slice(0, nameArr.length - 1).join('/'))}`, { recursive: true })
        .then(() => {

          //* Creates page file
          fs.promises.writeFile(`${path.join(pageRoute, name + pageFileExtension)}`, constructedElements.component)
            .then(() => {
              console.log(chalk.green.bold(`Created-file: ${pageRoute}/${name}${pageFileExtension}`))
            })
        })
    }

    if (!options.skip_style) {
      //* Creates style module file
      await fs.promises.writeFile(path.join(styleRoute, nameForStyleAndTest + ".module" + styleFileExtension), constructedElements.styles)
        .then(() => {
          console.log(chalk.green.bold(`Created-file: ${styleRoute}/${nameForStyleAndTest}.module${styleFileExtension}`))
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
          fs.promises.writeFile(path.join(testRoute, nameForStyleAndTest + ".spec" + testFileExtension),
            constructedElements.test
          ).then(() => {
            console.log(chalk.green.bold(`Created-file: ${testRoute}/${nameForStyleAndTest}.spec${testFileExtension}`))
          })
        })
    }

  })
    .catch((err: any) => console.log(chalk.red(err)))
}