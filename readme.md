# Next-cli
## requirements
I have not done much testing to see what can be skiped for this, and for release (if do that) I will probably complie it to js so that ts is not required.

\<project root\>/package.json
```
"dependencies": {
    "@next/font": "13.1.6",
    "@types/node": "18.13.0",
    "@types/react": "18.0.28",
    "@types/react-dom": "18.0.11",
    "next": "13.1.6",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "sass": "^1.58.1",
    "typescript": "4.9.5"
  },
"devDependencies": {
    "@babel/preset-env": "^7.20.2",
    "@babel/preset-react": "^7.18.6",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@types/jest": "^29.4.0",
    "babel-jest": "^29.4.2",
    "jest": "^29.4.2",
    "jest-environment-jsdom": "^29.4.3",
    "ts-jest": "^29.0.5"
  }
```

\<project root\>/nx.config.json --example
```
{
  "pageRoute":"./src/pages",
  "styleRoute": "./src/styles",
  "testRoute": "./src/test",
  "pageFileExtension": ".tsx",
  "testFileExtension": ".ts",
  "styleFileExtension": ".scss"
}
```

## Getting started
from the root dir for this cli
since -g, --global seems to be deprecated
```
$ npm install --location=global
```
which will install this globally on your system, allowing you to use it in any next project (not meant for other types of projects, but maybe could configure it to be fine, but routing could be the issue) 

### commands
 - init -- creates nx.config.json
 - generate | g \<page\> \<page name\> [scaffold] -- generates page, style, and test files, scaffold is optional

scaffold examples
  - scaffold format 
  ```
{
  f?: [
    n: string // name of the function
    a?: string[] | string // arguments for the function
  ] // functions for the component
  r?: [ // element/s to return
    t?: string // html tag
    h?: string<"ocl" || "och"> | Array< string <"ocl" || "och"> > // handleClick, and handleChange
    c?: string // inner content -- will appear above the children
    cl?: string[] | string // classname
    ch?: [] // child elements... maybe this could combine with c, but idk right now
  ]
}
```
```
$ nx g page home/index '{"f": [{ "n": "test", "a": ["testArg", "argTwo"] }, { "n": "funcTwo" }, { "n": "oneArg", "a": "one" }], "r": [{"t": "span","cl": "style_as_string", "c": "this is the content", "ch": [{ "t": "span", "cl": ["span", "other_style"], "h": ["ocl", "och"], "c": "inner content", "ch": [{ "h": ["ocl"], "c": "inner inner", "cl": ["oneName"] }] }] }] }'
```
or in this case
```
$ nx g page home/index --template first
```
will output something like

<br>

terminal:
```
Created-file: ./src/styles/home_index.module.scss
Created-file: ./src/pages/home/index.tsx
Created-file: ./src/test/home/index.spec.ts
```

./src/pages/home/index.tsx: 
```
import styles from '../../styles/home_index.module.scss'
export default function Index() {
  const test = (testArg: any, argTwo: any): any => {} // please add your own types / interfaces
  const funcTwo = (): any => {} // please add your own types / interfaces
  const oneArg = (one: any): any => {} // please add your own types / interfaces
  const handleClick = (e: any) => {} // please add your own types / interfaces
  const handleChange = (e: any) => {} // please add your own types / interfaces
  return (
    <>
      <span className={styles.style_as_string}>this is the content
        <span className={`${styles.span} ${styles.other_style}`}
          onClick={handleClick}        
          onChange={handleChange}
        >inner content
          <div className={`${styles.oneName}`}
            onClick={handleClick}
          >inner inner</div>
        </span>
      </span>
    </>
  )
}
```

./src/test/home/index.spec.ts:
```
import Index from '../pages/home/index'
import { render } from "@testing-library/react"
function renderPage() {
  return render(Index())
}
test("should display make_this_dynamic", async () => {
  // const {findByTestId} = renderPage()
  // const page = await findByTestId("make_this_dynamic")
})
```

./src/styles/home_index.module.scss:
```
.style_as_string {}
.span {}
.other_style {}
.oneName {}
```
#### flags:
```
  -p | --skip_page,  skips the page
  -s | --skip_style, skips the style module
  -t | --skip_test,  skips the test
  -d | --delete,   deletes the files generated, but can skip deletion of some with flags
  --template, used with generate page, it uses an example template to scaffold the page
```
    
 their will be more to come.