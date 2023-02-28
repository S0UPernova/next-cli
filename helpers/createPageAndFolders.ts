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

    const createOrDeleteFile = async (fullFilePath: string, content: string) => {
      // todo add prompt to ask if you want to overwrite them
      await fs.promises.readFile(fullFilePath)
        .then(() => {
          if (options.delete) {
            //todo maybe have any empty dirs leading to it also get removed somehow
            // Deletes the page
            fs.promises.rm(fullFilePath).then(() => {
              console.log(chalk.red(`Deleted: ${fullFilePath}`))
            })
          }
          else {
            console.log(chalk.yellow(`File-exists: ${fullFilePath}`))
          }
        })
        .catch(err => {
          if (err.code === "ENOENT" && !options.delete) {
            //* Creates the file
            fs.promises.writeFile(`${fullFilePath}`, content)
              .then(() => {
                console.log(chalk.green.bold(`Created-file: ${fullFilePath}`))
              })
          }
          else console.log(chalk.red(err))
        })
    }

    if (!options.skip_page) {
      //* Creates the directories to get to the final file location (unless they already exist)
      await fs.promises.mkdir(`${path.join(pageRoute, nameArr.slice(0, nameArr.length - 1).join('/'))}`, { recursive: true })
        .then(() => {
          //* Creates the page file
          createOrDeleteFile(path.join(pageRoute, name + pageFileExtension), constructedElements.component)
        })
    }

    if (!options.skip_style) {
      //* Creates the directories to get to the final file location (unless they already exist)
      await fs.promises.mkdir(styleRoute, { recursive: true })
        .then(() => {
          //* Creates style module file
          createOrDeleteFile(path.join(styleRoute, nameForStyleAndTest + ".module" + styleFileExtension), constructedElements.styles)
        })
    }

    if (!options.skip_test) {
      //* Creates the directories to get to the final file location (unless they already exist)
      await fs.promises.mkdir(testRoute, { recursive: true })
        .then(() => {
          //* Creates test for page
          createOrDeleteFile(path.join(testRoute, nameForStyleAndTest + ".spec" + testFileExtension), constructedElements.test)
        })
    }
  })
    .catch((err: any) => console.log(chalk.red(err)))
}