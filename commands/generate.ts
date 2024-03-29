import chalk from 'chalk'
import createPageAndFolders from '../helpers/createPageAndFolders'
export default function generate(gen: string, name: string) {
  if (!gen || !name) {
    console.log("missing param/s")
    return
  }

  switch (gen) {
    //? maybe have it make index pages for each empty dir it creates
    case "p":
    case "page":
      if (name.match(/^\/?api\/?/i)) {
        console.log(chalk.red("Please use nx g api <route/name>"))
      }
      else {
        createPageAndFolders(name)
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