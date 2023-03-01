export default function getNames(pathAndOrName: string) {
  const nameArr: string[] = pathAndOrName.split('/')
  const pageName: string = nameArr[nameArr.length - 1].split('').filter(s => s !== "[" && s !== "]").join("")
  const componentName: string = pageName.split(/[-_]/)[0].slice(0, 1).toUpperCase() + pageName.slice(1)
  const nameForStyleAndTest = pathAndOrName.replace(/\//g, "_").replace(/[\[\]]/g, "")

  return {
    nameArr: nameArr,
    pageName: pageName,
    componentName: componentName,
    nameForStyleAndTest: nameForStyleAndTest
  }
}