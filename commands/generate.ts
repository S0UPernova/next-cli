import chalk from 'chalk'
import { program } from 'commander'
import createPageAndFolders from '../helpers/createPageAndFolders'
export default function generate(gen: string, name: string, scaffold?: any) {
  const options = program.opts()
  if (!gen || !name) {
    console.log("missing param/s")
    return
  }

  switch (gen) {
    //? maybe have it make index pages for each empty dir it creates
    case "p":
    case "page":
      // todo add check to make sure it is not api/*
      // todo add delete option
      if (options?.delete) {
        console.log(chalk.red.bold("deletion coming soon-ish"))
      }
      else {
        if(name.match(/^\/?api\/?/i)) {
          console.log(chalk.red("Please use nx g api <route/name>"))
        }
        else {
          createPageAndFolders(name, scaffold)
        }
      }
      break
    case "test":
      console.log(chalk.blue("Will just gen a test could do test/integration/thing and file extensions are added automatically"))
      break
    case "style":
      break
    case "api":
      
      console.log(chalk.blue("creates file in api folder... coming soon"))
      break
  }
}