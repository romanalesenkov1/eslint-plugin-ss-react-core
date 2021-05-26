ESLint-plugin-ss-react-core
===================

SS React Core specific linting rules for ESLint

# Installation

Install ESLint-plugin-ss-react-core

```sh
$ npm install https://github.com/romanalesenkov1/eslint-plugin-ss-react-core.git --save
```

# Configuration
Add "ss-react-core" to the plugins section of .eslintrc.yml

```yml
plugins:
  - ss-react-core
```

Enable the rules that you would like to use.

```yml
rules:
  'ss-react-core/jsx-sort-template-name-prop': 'error'
```

# List of supported rules

* `ss-react-core/jsx-sort-template-name-prop`: Enforce 'templateName' to be the first prop