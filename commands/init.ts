import chalk from 'chalk'
import fs from 'fs'
import config from '../helpers/getConfig'
// todo use indent function here, and ask how many spaces per level, and add that to conf, and have indent use that in future
export default function init() {
  // this is to stop the error from logging in the console for this command, because it would be weird,
  //  if it complained about not having the config file when running the command to make it
  // todo make it only ignore that specific error 
  config.catch(() => { })


  // Variables to be used when building the json file
  let usingTypeScript: boolean = false,
    pageFileExtension: string = ".jsx",
    testFileExtension: string = "js",
    styleFileExtension: string = '.css',
    usingAppDir: boolean = false,
    usingSrcDir: boolean = false,
    shouldCreateJestConfig: boolean = true,
    shouldInstallDependencies: boolean = true

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
        srcDirQuestion()
      }
      else if (name.toLowerCase() === 'n') {
        styleFileExtension = ".css"
        srcDirQuestion()
      }
      else {
        console.log("please use requested response format")
        pickStyleFileExtension()
      }
    })

  }

  function srcDirQuestion() {
    readline.question('Are you using the src directory [y] [n] ', (name: string) => {
      if (name.toLowerCase() === 'y') {
        usingSrcDir = true
        appDirQuestion()
      }
      else if (name.toLowerCase() === 'n') {
        usingSrcDir = false
        appDirQuestion()
      }
      else {
        console.log("please use requested response format")
        srcDirQuestion()
      }
    })

  }

  function appDirQuestion() {
    readline.question('Are you using the expimental app directory [y] [n] ', (name: string) => {
      if (name.toLowerCase() === 'y') {
        usingAppDir = true
        allowCreationOfJestConfig()
      }
      else if (name.toLowerCase() === 'n') {
        usingAppDir = false
        allowCreationOfJestConfig()
      }
      else {
        console.log("please use requested response format")
        appDirQuestion()
      }
    })

  }

  function allowCreationOfJestConfig() {
    readline.question('Would you like to use this to create the jest config? [y] [n] ', (name: string) => {
      if (name.toLowerCase() === 'y') {
        shouldCreateJestConfig = true
        allowPackageInstallation()
      }
      else if (name.toLowerCase() === 'n') {
        shouldCreateJestConfig = false
        allowPackageInstallation()
      }
      else {
        console.log("please use requested response format")
        allowCreationOfJestConfig()
      }
    })

  }

  function allowPackageInstallation() {
    readline.question('Would you like this to install a few packages for you? [y] [n] ', (name: string) => {
      if (name.toLowerCase() === 'y') {
        shouldInstallDependencies = true
        createNxConfig(pageFileExtension, testFileExtension, styleFileExtension)
        if (shouldCreateJestConfig) createJestConfig(usingTypeScript)
        if (shouldInstallDependencies) installTheDependencies(usingTypeScript)
        readline.close()
      }
      else if (name.toLowerCase() === 'n') {
        shouldInstallDependencies = false
        createNxConfig(pageFileExtension, testFileExtension, styleFileExtension)
        if (shouldCreateJestConfig) createJestConfig(usingTypeScript)
        readline.close()
      }
      else {
        console.log("please use requested response format")
        allowPackageInstallation()
      }
    })

  }

  const createNxConfig = (pageFormat: string, testFormat: string, styeFormat: string) => { // todo alter this to better work with app dir
    const initialConfig =
      `{\n`
      + `  "usingAppDir": ${usingAppDir},\n`
      + `  "usingSrcDir": ${usingSrcDir},\n`
      + `  "pageRoute":".${usingSrcDir ? "/src" : ""}${usingAppDir ? "/app" : "/pages"}",\n`
      + `  "styleRoute":".${usingSrcDir ? "/src" : ""}${usingAppDir ? "/app" : "/styles"}",\n`
      + `  "testRoute":".${usingSrcDir ? "/src" : ""}${usingAppDir ? "/app" : "/test"}",\n`
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

  const createJestConfig = (isTypeScript: boolean) => {
    const initialConfig = `/*
    * For a detailed explanation regarding each configuration property and type check, visit:
    * https://jestjs.io/docs/configuration
    */
   // jest.config.js
   const nextJest = require('next/jest')
   
   const createJestConfig = nextJest({
     // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
     dir: './',
   })
   
   // Add any custom config to be passed to Jest
   /** @type {import('jest').Config} */
   const customJestConfig = {
     // Add more setup options before each test is run
     // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
     moduleDirectories: ['node_modules', '<rootDir>/'],
   
     // If you're using [Module Path Aliases](https://nextjs.org/docs/advanced-features/module-path-aliases),
     // you will have to add the moduleNameMapper in order for jest to resolve your absolute paths.
     // The paths have to be matching with the paths option within the compilerOptions in the tsconfig.json
     // For example:
   
     moduleNameMapper: {
       '@/(.*)$': '<rootDir>/src/$1',
     },
     testEnvironment: 'jest-environment-jsdom',
   }
   
   // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
   ${isTypeScript ? "export default" : "module.exports ="} createJestConfig(customJestConfig)`
    fs.promises.writeFile(`jest.config.${isTypeScript ? "ts" : "js"}`, initialConfig).then(() => {
      console.log(chalk.green.bold(`Created-file: jest.config.${isTypeScript ? "ts" : "js"}`))
    })
      .catch((err: any) => {
        console.error(err)
      })

  }

  const installTheDependencies = (isTypeScript: boolean) => {
    const { exec } = require("child_process");
    exec(`npm i --save-dev @testing-library/jest-dom@"^5.16.5" @testing-library/react@"^14.0.0" jest@"^29.4.3" jest-environment-jsdom@"^29.4.3" @testing-library/jest-dom@"^5.16.5"${isTypeScript ? ' ts-node@"^10.9.1" ts-jest@"^29.0.5" @types/jest@"^29.4.0"' : ""}${styleFileExtension === ".scss" ? " sass": ""} && npm set-script test jest`, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`${stdout}`);
    })
  }

  //* start questions
  isTypeScript()
}