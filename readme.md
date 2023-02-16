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

### commands
 - init -- creates nx.config.json
 - generate | g \<page\> \<page name\> -- generates page, style, and test files

 their will be more to come.