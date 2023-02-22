
declare module "scaffold" {  // todo make this shit work
  interface builtScaffold {
   component: string
   styles: string
   test: string
 }
  interface functions {
   n: string // name of the function
   a?: string[] | string // arguments for the function
 }
  type handlers =  "ocl" |  "och"
 
  interface element {
   t?: string // html tag
   h?: handlers | Array<handlers> // handleClick and such //todo make this an array 
   c?: string // inner content -- will appear above the children
   cl?: string[] | string // classname
   ch?: element[] // child elements
 }
  interface component {
   f?: Array<functions> // functions for the component
   r?: Array<element>
 }

 interface scaffold {
  component: component
  handlers: handlers
  builtScaffold: builtScaffold
  element: element
  functions: functions
 }
 var scaffold:scaffold
 export = scaffold
}