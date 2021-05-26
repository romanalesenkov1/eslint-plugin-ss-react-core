ESLint-plugin-ss-react-core
===================

SS React Core specific linting rules for ESLint

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally. (Note that locally, per project, is strongly preferred)

```sh
$ npm install eslint --save-dev
```

If you installed `ESLint` globally, you have to install React plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-ss-react-core --save-dev
```

# Configuration
Add "ss-react-core" to the plugins section.

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