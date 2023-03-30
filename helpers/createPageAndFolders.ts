import { program } from 'commander'
import fs from 'fs'
import chalk from 'chalk'

import config from '../helpers/getConfig'
import buildFiles from './buildFiles'
import getNames from './getNames'
import createOrDeleteFile from './createOrDeleteFile'
import getPaths from './getPaths'
import delay from './delay'

// todo complete support for app directory
export default function createPageAndFolders(pathAndOrName: string): any {
  config.then(async (conf) => {
    const path = require('node:path'),
      paths = await getPaths(pathAndOrName),
      options = program.opts(),
      names = getNames(pathAndOrName),
      usingAppDir: boolean = conf?.usingAppDir !== undefined ? conf.usingAppDir : false,
      pageRoute: string = conf?.pageRoute ? conf.pageRoute : './src/pages',
      styleRoute: string = conf?.styleRoute ? conf.styleRoute : './src/styles',
      testRoute: string = conf?.testRoute ? conf.testRoute : './src/test'

    //* The build step
    const constructedElements = await buildFiles(
      {
        fullPath: pathAndOrName,
        nameForStyleAndTest: names.nameForStyleAndTest,
        pageName: names.pageName,
        componentName: names.componentName
      }
    )

  
    //* The creation step 
    if (!options.skip_style) {
      //* Creates the directories to get to the final file location (unless they already exist)
      await fs.promises.mkdir(`${usingAppDir ? `${path.join(pageRoute, pathAndOrName)}` : styleRoute}`, { recursive: true })
        .then(() => {
          //* Creates style module file
          createOrDeleteFile(paths.styleFullPath, constructedElements.styles)
        })
    }

    if (!options.skip_test) {
      //* Creates the directories to get to the final file location (unless they already exist)
      await fs.promises.mkdir(`${usingAppDir ? `${path.join(pageRoute, pathAndOrName)}` : testRoute}`, { recursive: true })
        .then(() => {
          //* Creates test for page
          createOrDeleteFile(paths.testFullPath, constructedElements.test)
        })
    }

    //* page is last, because it has the logic for removeing the folders
    if (!options.skip_page) {
      if (!options.delete) {

        //* Creates the directories to get to the final file location (unless they already exist)
        await fs.promises.mkdir(`${path.join(
          pageRoute, pathAndOrName.split("/").length > 1 ? pathAndOrName : "")}`, { recursive: true }
        )
          .then(() => {
            //* Creates the page file
            createOrDeleteFile(paths.pageFullPath, constructedElements.component)
          })
      }
      else {
        createOrDeleteFile(paths.pageFullPath, constructedElements.component)
          .then(async () => {
              const arr = names.nameArr
              for (let i = arr.length; i > 0; i--) {
                await delay(10) // this is to make it wait for dir to be empty 
                fs.promises.opendir(`${pageRoute}/${arr.slice(0, i).join('/')}`)
                .then(async (dir) => {
                  const content = await dir.read()
                  await dir.close()
                  if (content === null) {
                    fs.promises.rmdir(`${pageRoute}/${arr.slice(0, i).join('/')}`)
                    .then(() => {
                      console.log(chalk.red(`Removed directory: ${`${pageRoute}/${arr.slice(0, i).join('/')}`}`))
                    })
                  }
                })
                .catch(() => {}) // silent, because it could be from using default next, and having a named page in /pages

            }
          })
      }
    }

  })
    .catch((err: any) => console.log(chalk.red(err)))
}