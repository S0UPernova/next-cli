import chalk from 'chalk'
import fs from 'fs'
import config from '../getConfig'
export default function init() {
  // this is to stop the error from logging in the console for this command, because it would be weird,
  //  if it complained about not having the config file when running the command to make it
  config.catch(() => { })
  // Variables to be used when building the json file
  let usingTypeScript: boolean = false
  let pageFileExtension: string = ".jsx"
  let testFileExtension: string = "js"
  let styleFileExtension: string = '.css'

  // function to get input from the user
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function isTypeScript() {
    readline.question('Will you be using TypeScript? [y/n] ', (name: string) => {
      if (name.toLowerCase() === 'y') {
        usingTypeScript = true
        testFileExtension = ".ts"
        pickPageFileExtension()

      }
      else if (name.toLowerCase() === 'n') {
        usingTypeScript = false
        testFileExtension = ".js"
        pickPageFileExtension()

      }
      else {
        console.log("please use requested response format")
        isTypeScript()
      }
    })
  }

  function pickPageFileExtension() {
    if (usingTypeScript) {
      readline.question('Would You like to use tsx? .tsx[y] .ts[n] ', (name: string) => {
        if (name.toLowerCase() === 'y') {
          pageFileExtension = ".tsx"
          pickStyleFileExtension()
        }
        else if (name.toLowerCase() === 'n') {
          pageFileExtension = ".ts"
          pickStyleFileExtension()
        }
        else {
          console.log("please use requested response format")
          pickPageFileExtension()
        }
      })
    }
    else {
      readline.question('Would You like to use jsx? .jsx[y] .js[n] ', (name: string) => {
        if (name.toLowerCase() === 'y') {
          pageFileExtension = ".jsx"
          pickStyleFileExtension()
        }
        else if (name.toLowerCase() === 'n') {
          pageFileExtension = ".js"
          pickStyleFileExtension()
        }
        else {
          console.log("please use requested response format")
          pickPageFileExtension()
        }
      })
    }
  }

  function pickStyleFileExtension() {
    readline.question('Would you like to use scss? .scss[y] .css[n] ', (name: string) => {
      if (name.toLowerCase() === 'y') {
        styleFileExtension = ".scss"
        createConfig(pageFileExtension, testFileExtension, styleFileExtension)
        readline.close()
      }
      else if (name.toLowerCase() === 'n') {
        styleFileExtension = ".css"
        createConfig(pageFileExtension, testFileExtension, styleFileExtension)
        readline.close()
      }
      else {
        console.log("please use requested response format")
        pickStyleFileExtension()
      }
    })

  }
  
  const createConfig = (pageFormat: string, testFormat: string, styeFormat: string) => {
    const initialConfig =
      `{\n`
      + `  "pageRoute":"./src/pages",\n`
      + `  "styleRoute": "./src/styles",\n`
      + `  "testRoute": "./src/test",\n`
      + `  "pageFileExtension": "${pageFormat}",\n`
      + `  "testFileExtension": "${testFormat}",\n`
      + `  "styleFileExtension": "${styeFormat}"\n`
      + `}`
    fs.promises.writeFile('nx.config.json', initialConfig).then(() => {
      console.log(chalk.green.bold(`Created-file: nx.config.json`))
    })
      .catch((err: any) => {
        console.error(err)
      })
  }

    //* start questions
    isTypeScript()
}