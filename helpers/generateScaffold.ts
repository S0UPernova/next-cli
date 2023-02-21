//! not sure if this will be good for productivity over just writing it nomally
// todo add tests based on scaffold
// todo add scaffolding for styles 

import chalk from "chalk"
import config from './getConfig'

//? maybe just stub out the styles with the classNames 
interface functions {
  n: string // name of the function
  a?: string[] | string // arguments for the function
}
type handlers = string
"ocl" ||  // onClick
  "och" // onChange

interface element {
  t?: string // html tag
  h?: handlers | Array<handlers> // handleClick and such
  c?: string // inner content -- will appear above the children
  cl?: string[] | string // classname
  ch?: element[] // child elements
}
interface component {
  f?: Array<functions> // functions for the component
  r?: Array<element> // todo allow single element not in array
}
/**
 * 
 * @param name What to name the function
 * @param args What arguments should it have
 * @returns {string} A string of a function definition
 */
function indentation(indentLevel: number, spacesPerIndent: number) {
  const indentBy: string = ` `.repeat(spacesPerIndent !== undefined ? spacesPerIndent : 2)
  const indent: string = indentBy.repeat(indentLevel !== undefined ? indentLevel : 1)
  return indent
}
export default function generateScaffold(gen: component, usingTypeScript: boolean) {

    // todo for ts add types to args... maybe start with any
    function buildFunction(name: string, args: string[] | string | undefined, indentLevel?: number, spacesPerIndent?: number): string {
      let arg: string
      if (args && args?.length > 1 && Array.isArray(args)) {
        arg = args.join(`${usingTypeScript ? ": any": ""}, `) + `${usingTypeScript ? ": any": ""}`
      }
      else if (args && args.length === 1 && Array.isArray(args)) {
        arg = args[0]
      }
      else if (args && typeof args === "string") {
        arg = args + `${usingTypeScript ? ": any": ""}`
      }
      else {

        arg = ""
      }
      const built = `${indentation(indentLevel ? indentLevel : 1, spacesPerIndent !== undefined ? spacesPerIndent : 2)}const ${name} = (${arg})${usingTypeScript ? ": any": ""} => {} ${usingTypeScript ? "// please add your own types / interfaces": ""}`
      return built
    }

    const classNamesUsed: string[] = [] // Global for the style generation 
    function buildStyles(classnames: string[] | string): string {
      let styles: string
      if (Array.isArray(classnames) && classnames.length > 0) {
        styles = classnames.map((name: string, i: number) => `.${name} {}`).join("\n")
      }
      else if (typeof classnames === 'string' && classnames.length > 0) {
        styles = `.${classnames}`
      }
      else styles = ""
      return styles
    }
    function buildElements(elements: element[], indentLevel?: number, spacesPerIndent?: number) {
      const handlersUsed: string[] = []
      const construct = (elements: element[], indentLevel?: number, spacesPerIndent?: number) => {
        const handlers = {
          och: "onChange",
          ocl: "onClick"
        }
        const element = elements.map((element: element, i) => {
          // the about of spaced needed for the current level of indentation
          const indent = indentation(indentLevel !== undefined ? indentLevel : 1, spacesPerIndent !== undefined ? spacesPerIndent : 2)
          // className for component, if it has been specified
          let elStyle: string
          if (Array.isArray(element.cl)) {
            element.cl.forEach((name: string) => {
              if (!classNamesUsed.includes(name)) {
                classNamesUsed.push(name)
              }
            })
            elStyle = ` className={\`${element.cl.map((name, i) => `\${styles.${name}`).join("} ")}}\`}` //? maybe make it work like the string version if arr.length is 1
          }
          else if (typeof element.cl === "string" && !classNamesUsed.includes(element.cl)) {
            classNamesUsed.push(element.cl)
            elStyle = ` className={styles.${element.cl}}`
          }
          else {
            elStyle = ""
          }
          const built: string = `${indent}<${element.t ? element.t : "div"}${elStyle}${element?.h !== undefined ?
            element?.h && Array.isArray(element.h) ? element.h.map((key: string) => {
              if (Object.keys(handlers).includes(key)) {
                let k = key as keyof typeof handlers
                const nameOfHandler = `handle${handlers[k].slice(2)}`
                if (!handlersUsed.includes(nameOfHandler)) handlersUsed.push(nameOfHandler)
                return `\n${indentation(indentLevel ? indentLevel + 1 : 2, spacesPerIndent !== undefined ? spacesPerIndent : 2)}${handlers[k]}={${nameOfHandler}}`
              }
            }).join(`${indent}`) + `\n${indent}` : ""

            : ""
            }>${element?.c ? element.c : ""}${element?.ch ? `\n` + construct(element.ch, indentLevel ? indentLevel + 1 : 1, spacesPerIndent !== undefined ? spacesPerIndent : 2) + `\n${indent}` : ""}</${element.t ? element.t : "div"}>`
          return built
        })
        return element.join()
      }

      const elementOrElements = construct(elements, indentLevel ? indentLevel + 1 : 1, spacesPerIndent !== undefined ? spacesPerIndent : 2)
      return `${handlersUsed.length > 0 ? handlersUsed.map(handler => {
        return `${indentation(indentLevel ? indentLevel - 1 : 1, spacesPerIndent !== undefined ? spacesPerIndent : 2)}const ${handler} = (e${usingTypeScript ? ": any": ""}) => {} ${usingTypeScript ? "// please add your own types / interfaces": ""}`
      }).join("\n") + "\n" : ""}`
        + `  return (\n`
        + `${indentation(indentLevel ? indentLevel : 1, spacesPerIndent !== undefined ? spacesPerIndent : 2)}<>\n`
        + `${elementOrElements ? elementOrElements + "\n" : ""}`
        + `${indentation(indentLevel ? indentLevel : 1, spacesPerIndent !== undefined ? spacesPerIndent : 2)}</>\n`
        + `${indentation(indentLevel ? indentLevel - 1 : 1, spacesPerIndent !== undefined ? spacesPerIndent : 2)})\n`
    }
    const functions = gen?.f?.map(fn => (buildFunction(fn.n, fn.a))).join('\n') // maybe abstract the .map
    const elements = gen?.r ? buildElements(gen.r, 2, 2) : ""
    const component = `${functions ? functions + "\n" : ""}${elements}`
    const styles = buildStyles(classNamesUsed)
    const test = `test("should display make_this_dynamic", async () => {\n` //todo add scaffolding for tests
      + `  // const {findByTestId} = renderPage()\n`
      + `  // const page = await findByTestId("make_this_dynamic")\n`
      + `})\n` // todo get tests to integrate, and then get this to actually write the files
    // todo maybe use this return in createPageAndFolders, and replace component, style, and test with these values
    return { styles: styles, component: component, test: test } //! change from return to writing files
}
