# Next-cli
## requirements
I have not done much testing to see what can be skiped for this, and for release (if do that) I will probably complie it to js so that ts is not required.

## step I need to automate
`npm i --save-dev @testing-library/jest-dom@"^5.16.5" @testing-library/react@"^14.0.0" jest@"^29.4.3" jest-environment-jsdom@"^29.4.3" ts-node@"^10.9.1"

dev Dependencies
```
"@testing-library/react": "^13.4.0"
"jest": "^29.4.2"
"jest-environment-jsdom": "^29.4.3"
"@testing-library/jest-dom": "^5.16.5"

// if you are using typescript
"@types/jest": "^29.4.0"
"ts-node": "^10.9.1"
  
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
<br>

---

<br>

## Getting started
from the root dir for this cli
since -g, --global seems to be deprecated
```
$ npm install --location=global
```
which will install this globally on your system, allowing you to use it in any next project (not meant for other types of projects, but maybe could configure it to be fine, but routing could be the issue) 

<br>

---

<br>

## commands
### init
- creates nx.config.json
- can create jest.config.ts/jest.config.js
- adds test to scripts
- can install the needed packages for testing
<br>

---

<br>

### generate | g \<page\> \<page path and or name\> -- generates page, style, and test files

<br>

```
$ nx g page home/index --template templateName
```
will output something like

<br>

terminal:
```
Created-file: ./src/styles/home_index.module.scss
Created-file: ./src/pages/home/index.tsx
Created-file: ./src/test/home_index.spec.ts
```

./src/pages/home/index.tsx: 
```
... still working on this
```

./src/test/home/index.spec.ts:
```
... still working on this
```

./src/styles/home_index.module.scss:
```
... still working on this
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