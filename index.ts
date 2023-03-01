#!/usr/bin/env ts-node

import { program } from 'commander'
import init from './commands/init'
import generate from "./commands/generate"

//* setting up options / flags
program.option('-d, --delete', "Delete generation")
program.option('-t, --skip_test', "Skips test")
program.option('-p, --skip_page', "Skips page")
program.option('-s, --skip_style', "Skip style module")
program.option('-T, --template <template name>', 'Use a templateC')
program.option('-f, --force', 'forces action, for example when generating you can force it to overwrite existing files\n coming soon...')

program.command("init")
  .description("initialize nx.config.json")
  .action(init)

program
  .command("generate <whatToMake> <whatToNameIt>")
  .alias("g")
  .description(
    "$ nx g, or $ nx generate <type> <name>\n"
    + " - File extensions are added automatically\n"
    + " - You can use slash [/] to specify the route i.e. about/us/index\n"
    + `   The about and us are the folders and the last element which is index in this case \n`
    + `   is the page name that is used to make the file.`
  )
  .action(generate)

// console.log(program.opts())
program.parse()
// todo fix automatically - atomically typo in conf readme and submit a pull request