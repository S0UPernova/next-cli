// todo add prompt to ask if you want to overwrite existing files
import chalk from 'chalk'
import fs from 'fs'
import { program } from 'commander'
export default async function createOrDeleteFile(fullFilePath: string, content: string) {
  const options = program.opts()
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
        //* Using setTimeout of zero so that it waits for the dir to be created, not sure why I need to since it is in a .then
        setTimeout(() => { //! puts this on the event queue
          fs.promises.writeFile(`${fullFilePath}`, content)
            .then(() => {
              console.log(chalk.green.bold(`Created-file: ${fullFilePath}`))
            })
        }, 0)
      }
      else console.log(chalk.red(err))
    })
}