import getNames from "./getNames"
import config from "./getConfig"

interface paths {
  pagePathWithoutFileExt: string
  styleImportPath: string
  componentImport: string
  pageFullPath: string
  styleFullPath: string
  testFullPath: string
}

export default function getPaths(pathAndOrName: string): Promise<paths> {
  const
    path = require('node:path'),
    names = getNames(pathAndOrName) // not sure I like it depending on this, but eh whatever

  return config.then(async (conf: any) => {
    const styleImportPath = `${conf?.usingAppDir ? `./${names.pageName}.module${conf.styleFileExtension}` : path.relative(
      path.join(conf.pageRoute, pathAndOrName.split("/").slice(0, pathAndOrName.split("/").length - 1).join("/")),
      path.join(conf.styleRoute, names.nameForStyleAndTest + ".module" + conf.styleFileExtension))}`

    const componentImport = `${conf.usingAppDir ? `./page` : path.relative(path.join(conf.testRoute), path.join(conf.pageRoute, pathAndOrName))}`

    const pagePathWithoutFileExt = `${path.join(
      conf.pageRoute, `${conf?.usingAppDir
        ? pathAndOrName + "/page" // not sure if this all will work
        : pathAndOrName}`
    )}`
    
    const pageFullPath = `${pagePathWithoutFileExt + conf.pageFileExtension}`

    const styleFullPath = `${path.join(
      `${conf.usingAppDir ? conf.pageRoute : conf.styleRoute}`,
      `${conf.usingAppDir ? pathAndOrName + (names.nameArr.length ? `/${names.nameArr.slice(names.nameArr.length - 1)}` : "") : names.nameForStyleAndTest}` + ".module" + conf.styleFileExtension
    )}`

    const testFullPath = `${path.join(
      `${conf.usingAppDir ? conf.pageRoute : conf.testRoute}`,
      `${conf.usingAppDir ? pathAndOrName + (names.nameArr.length ? `/${names.nameArr.slice(names.nameArr.length - 1)}` : "") : names.nameForStyleAndTest}` + ".spec" + conf.testFileExtension
    )}`

  

    return {
      pagePathWithoutFileExt,
      styleImportPath,
      componentImport,
      pageFullPath,
      styleFullPath,
      testFullPath
    }
  })
}