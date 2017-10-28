# sort-imports

Sort ES6 imports for JavaScript and TypeScript automatically.
Ported from the [atom-import-sort](https://atom.io/packages/atom-import-sort) package by [Renke Grunwald](https://github.com/renke).

![Sort Example](http://i.imgur.com/XEzc7EU.gif)

## Features

Automatically sorts imports on save. You can disable this behavior in the settings and sort imports manually:

1. Launch the Command Palette (`Ctrl/Cmd + Shift + P`);
1. Enter **Sort imports**

You can also save the document without saving imports. This could become handy when you have auto saving enabled, but don't want to sort the imports in a particular file:

1. Launch the Command Palette (`Ctrl/Cmd + Shift + P`);
1. Enter **Save file without sorting imports**

## Extension Settings

This extension has the following settings:

* `sort-imports.on-save`: enable/disable auto sorting on save (default: true).
* `sort-imports.suppress-warnings`: suppress warnings if sorting imports fails (default: false).
* `sort-imports.languages`: selectively choose the languages which should be sported (default: ['javascript', 'typescript']).

### Obsolete settings

See [release notes for version 4](https://github.com/amatiasq/vsc-sort-imports#400)

## Use a different style or parser

Styles (and parsers) can be configured on a per-project basis including support for different types of files (currently JavaScript and TypeScript).

Just add the following to your `package.json` and adapt it to your liking:

```json
"importSort": {
  ".js, .jsx, .es6, .es": {
    "parser": "babylon",
    "style": "eslint"
  },
  ".ts, .tsx": {
    "parser": "typescript",
    "style": "eslint"
  }
}
```

The keys are a list of file extensions that map to the parser and style that should be used for files that have any of the listed file extensions.

By default, `sort-import` comes with these styles:

* [`import-sort-style-eslint` (default)](https://github.com/renke/import-sort/tree/master/packages/import-sort-style-eslint): A style that that is compatible with [ESLint's](http://eslint.org/) [sort-imports](http://eslint.org/docs/rules/sort-imports) rule.

* [`import-sort-style-module`](https://github.com/renke/import-sort/tree/master/packages/import-sort-style-module): A style that groups and sorts by module.

* [`import-sort-style-module-compact`](https://github.com/amatiasq/import-sort-style-module-compact): Similar to modules but with fewer groups.

PRs with more styles are welcome.

## Release Notes

#### 4.0.0

Update to ease transition from [@peterjuras' extension](https://github.com/peterjuras/vsc-sort-imports).

* `sort-imports.blank-lines-after`: removed until a valid implementation is provided
* `sort-imports.sort-type`: you can now configure your sorting type folowing with a key in your `package.json`. [Documentation](https://github.com/renke/import-sort#using-a-different-style-or-parser)
  * `by-module-name`: is now `"style": "module-compact"`
  * `by-imported-name`: is removed

#### 3.0.0

- Renamed to sort-imports. Renamed config settings to slug-case.
- Fixed blank linkes after imports feature.

#### 2.4.0

- Implemented by [@danieloprado](https://github.com/danieloprado): Added setting to selectively choose the languages. Set `sortImports.languages` to an array of the languages that you want to be sorted, e.g. `['javascript']`.
- Bugfixes

#### 2.4.0 (amq-sort-imports fork)

- Import style `by-module-name` added.
- Added support for blank lines after imports.

#### 2.3.0

- Import sort style `module` is now included by default alongside the `eslint` style.

#### 2.2.0

- Added setting to suppress warnings. Set `sortImports.suppressWarnings` to `true` to hide warnings if sorting imports fails.

#### 2.1.0

- It is now possible to customize the import sort style. Please refer to the [import-sort documentation](https://github.com/renke/import-sort#using-a-different-style-or-parser) for more information.

### 2.0.0

- **Added TypeScript support**
- Fixed inline comments on import statements
- Thanks to @shalomdotnet for the [PR](https://github.com/peterjuras/vsc-sort-imports/pull/2)!

#### 1.1.0

- Added 'Save without sorting imports' command

### 1.0.0

Initial release


# Credits

Developed by [Peter Juras](https://github.com/peterjuras),
maintained by [A. Matías Quezada](https://github.com/amatiasq)

## Thanks

- Special thanks to [Renke Grunwald](https://github.com/renke) for creating the [import-sort](https://github.com/renke/import-sort) module!
- Icon made by [Catalin Fertu](http://www.flaticon.com/authors/catalin-fertu) from [www.flaticon.com]()
