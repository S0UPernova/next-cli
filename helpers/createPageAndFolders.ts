import { program } from 'commander'
import fs from 'fs'
import chalk from 'chalk'

import config from '../helpers/getConfig'
import buildFiles from './buildFiles'
import getNames from './getNames'
import createOrDeleteFile from './createOrDeleteFile'

export default function createPageAndFolders(pathAndOrName: string): any {
  const path = require('node:path')
  const options = program.opts()

  config.then(async (data) => {
    const names = getNames(pathAndOrName)
    const pageRoute: string = data?.pageRoute ? data.pageRoute : './src/pages'
    const styleRoute: string = data?.styleRoute ? data.styleRoute : './src/styles'
    const testRoute: string = data?.testRoute ? data.testRoute : './src/test'
    const pageFileExtension: string = data?.pageFileExtension ? data.pageFileExtension : '.jsx'
    const testFileExtension: string = data?.testFileExtension ? data.testFileExtension : '.js'
    const styleFileExtension: string = data?.styleFileExtension ? data.styleFileExtension : '.css'

    //* The build step
    const constructedElements = await buildFiles({ fullPath: pathAndOrName, nameForStyleAndTest: names.nameForStyleAndTest, pageName: names.pageName, componentName: names.componentName })


    //* The creation step 
    if (!options.skip_page) {
      //* Creates the directories to get to the final file location (unless they already exist)
      await fs.promises.mkdir(`${path.join(pageRoute, names.nameArr.slice(0, names.nameArr.length - 1).join('/'))}`, { recursive: true })
        .then(() => {
          //* Creates the page file
          createOrDeleteFile(path.join(pageRoute, pathAndOrName + pageFileExtension), constructedElements.component)
        })
    }

    if (!options.skip_style) {
      //* Creates the directories to get to the final file location (unless they already exist)
      await fs.promises.mkdir(styleRoute, { recursive: true })
        .then(() => {
          //* Creates style module file
          createOrDeleteFile(path.join(styleRoute, names.nameForStyleAndTest + ".module" + styleFileExtension), constructedElements.styles)
        })
    }

    if (!options.skip_test) {
      //* Creates the directories to get to the final file location (unless they already exist)
      await fs.promises.mkdir(testRoute, { recursive: true })
        .then(() => {
          //* Creates test for page
          createOrDeleteFile(path.join(testRoute, names.nameForStyleAndTest + ".spec" + testFileExtension), constructedElements.test)
        })
    }
  })
    .catch((err: any) => console.log(chalk.red(err)))
}