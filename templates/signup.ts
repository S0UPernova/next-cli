import { program } from 'commander'
const path = require('node:path')

import config from '../helpers/getConfig'
import indent from '../helpers/indent'

interface builtFiles {
  component: string
  styles: string
  test: string
}

export default function signup({ fullPath, nameForStyleAndTest, pageName, componentName }: any): Promise<builtFiles> {
  return config.then(async (conf: any) => {
    const options = program.opts()
    const usingTypeScript: boolean = conf.pageFileExtension === ".ts" || conf.pageFileExtension === ".tsx"
    const styleImport = !options.skip_style ? `import styles from '${path.relative(
      path.join(conf.pageRoute, fullPath.split("/").slice(0, fullPath.split("/").length - 1).join("/")),
      path.join(conf.styleRoute, nameForStyleAndTest + ".module" + conf.styleFileExtension)
    )}'\n` : ""

    const imports = `import {${usingTypeScript ? " ChangeEvent, FormEvent," : ""} useState } from 'react'\n`
      + styleImport

    const stateParams = `${indent(1)}const [email, setEmail] = useState("")\n`
      + `${indent(1)}const [password, setPassword] = useState("")\n`
      + `${indent(1)}const [passwordConfirmation, setPasswordConfirmation] = useState("")\n`

    const handlers = `${indent(1)}const handleSubmit = (e${usingTypeScript ? ": FormEvent" : ""})${usingTypeScript ? ": void" : ""} => {\n`
      + `${indent(2)}e.preventDefault()\n`
      + `${indent(2)}// add submit logic here\n`
      + `${indent(1)}}\n`
      + `${indent(1)}const handleChange = (e${usingTypeScript ? ": ChangeEvent<HTMLInputElement>" : ""}) => {\n`
      + `${indent(2)}const field${usingTypeScript ? ": string" : ""} = e.target.name\n`
      + `${indent(2)}const value${usingTypeScript ? ": string" : ""} = e.target.value\n`
      + `${indent(2)}switch (field) {\n`
      + `${indent(3)}case 'email':\n`
      + `${indent(4)}setEmail(value)\n`
      + `${indent(4)}break\n`
      + `${indent(3)}case 'password':\n`
      + `${indent(4)}setPassword(value)\n`
      + `${indent(4)}break\n`
      + `${indent(3)}case 'passwordConfirmation':\n`
      + `${indent(4)}setPasswordConfirmation(value)\n`
      + `${indent(4)}break\n`
      + `${indent(2)}}\n`
      + `${indent(1)}}\n`
    const component = imports
      + `export default function ${componentName}() {\n`
      + stateParams
      + handlers
      + `${indent(1)}return (\n`
      + `${indent(2)}<>\n`

      // Component body
      + `${indent(3)}<form\n`
      + `${!options.skip_test ? `${indent(4)}data-testid="form"\n` : ""}`
      + `${!options.skip_style ? `${indent(4)}className={styles.signup_form}\n` : ""}`
      + `${indent(4)}onSubmit={handleSubmit}\n`
      + `${indent(3)}>\n`

      + `${indent(4)}<label>\n`
      + `${indent(5)}Email:\n`      
      + `${indent(5)}<input\n`
      + `${!options.skip_test ? `${indent(6)}data-testid="email"\n` : ""}`
      + `${indent(6)}type="text"\n`
      + `${indent(6)}name="email"\n`
      + `${indent(6)}value={email}\n`
      + `${indent(6)}onChange={handleChange}\n`
      + `${indent(5)}/>\n`
      + `${indent(4)}</label>\n`
      
      + `${indent(4)}<label>\n`
      + `${indent(5)}Password:\n`
      + `${indent(5)}<input\n`
      + `${!options.skip_test ? `${indent(6)}data-testid="password"\n` : ""}`
      + `${indent(6)}type="password"\n`
      + `${indent(6)}name="password"\n`
      + `${indent(6)}value={password}\n`
      + `${indent(6)}onChange={handleChange}\n`
      + `${indent(5)}/>\n`
      + `${indent(4)}</label>\n`

      + `${indent(4)}<label>\n`
      + `${indent(5)}Password Confirmation:\n`
      + `${indent(5)}<input\n`
      + `${!options.skip_test ? `${indent(6)}data-testid="passwordConfirmation"\n` : ""}`
      + `${indent(6)}type="password"\n`
      + `${indent(6)}name="passwordConfirmation"\n`
      + `${indent(6)}value={passwordConfirmation}\n`
      + `${indent(6)}onChange={handleChange}\n`
      + `${indent(5)}/>\n`
      + `${indent(4)}</label>\n`

      + `${indent(4)}<button>Submit</button>\n`
      + `${indent(3)}</form>\n`

      + `${indent(2)}</>\n`
      + `${indent(1)})\n`
      + `}`

    // create a test for the component
    const test = options.skip_page ?
      `import { render } from "@testing-library/react"\n`
      + `//function renderPage() {\n`
      + `//${indent(1)}return render(componentName())\n`
      + `//}\n`
      + `describe("<componentName />", () => {\n`
      + `//${indent(1)}test("should display the content from element", async () => {\n`
      + `//${indent(2)}const {findByTestId} = renderPage()\n`
      + `//${indent(2)}const element = await findByTestId("data-testid")\n`
      + `//${indent(2)}expect(element.innerHTML).toEqual("content")\n`
      + `//${indent(1)}})\n`
      + `})`
      :
      `import ${componentName} from '${path.relative(path.join(conf.testRoute), path.join(conf.pageRoute, fullPath))}'\n`
      + `import { render } from "@testing-library/react"\n`
      + `import React from 'react'\n`
      + `import '@testing-library/jest-dom'\n\n`

      + `function renderPage() {\n`
      + `${indent(1)}return render(${componentName}())\n`
      + `}\n\n`
      + `const setState = jest.fn()\n`
      + `const useStateSpy = jest.spyOn(React, 'useState')\n`
      + `${usingTypeScript ? "let initialState: unknown\n" : ""}`
      + `useStateSpy.mockImplementation(${usingTypeScript ? "()" : "initialState"} => [initialState, setState])\n\n`

      + `describe("<${componentName} />", () => {\n`
      + `${indent(1)}test("should display the form element", async () => {\n`
      + `${indent(2)}const {findByTestId} = renderPage()\n`
      + `${indent(2)}const form = await findByTestId("form")\n`
      + `${indent(2)}expect(form).toBeInTheDocument()\n`
      + `${indent(2)}expect(form).not.toBeEmptyDOMElement()\n`
      + `${indent(1)}})\n\n`
      + `${indent(1)}test("should display the input elements", async () => {\n`
      + `${indent(2)}const {findByTestId} = renderPage()\n`
      + `${indent(2)}const emailInput = await findByTestId("email")\n`
      + `${indent(2)}const passwordInput = await findByTestId("password")\n`
      + `${indent(2)}const passwordConfirmationInput = await findByTestId("passwordConfirmation")\n`
      + `${indent(2)}expect(emailInput).toBeInTheDocument()\n`
      + `${indent(2)}expect(emailInput).toBeEmptyDOMElement()\n`
      + `${indent(2)}expect(passwordInput).toBeInTheDocument()\n`
      + `${indent(2)}expect(passwordInput).toBeEmptyDOMElement()\n`
      + `${indent(2)}expect(passwordConfirmationInput).toBeInTheDocument()\n`
      + `${indent(2)}expect(passwordConfirmationInput).toBeEmptyDOMElement()\n`
      + `${indent(1)}})\n`
      + `})`


    // create style for component
    const style = `.hello {`
      + `${indent(1)}color: green;`
      + `}`

    return {
      component: component,
      styles: style,
      test: test,
    }
  })
}