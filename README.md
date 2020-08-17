# sort-imports

Sort ES6 imports for JavaScript and TypeScript automatically.
Ported from the [atom-import-sort](https://atom.io/packages/atom-import-sort) package by [Renke Grunwald](https://github.com/renke).

![Sort Example](https://i.imgur.com/XEzc7EU.gif)

## Features

Automatically sorts imports on save. You can disable this behavior in the settings and sort imports manually:

1. Launch the Command Palette (`Ctrl/Cmd + Shift + P`);
1. Enter **Sort imports**

You can also save the document without saving imports. This could become handy when you have auto saving enabled, but don't want to sort the imports in a particular file:

1. Launch the Command Palette (`Ctrl/Cmd + Shift + P`);
1. Enter **Save file without sorting imports**

## Extension Settings

This extension has the following settings:

- `sort-imports.default-sort-style`: sorting style if `package.json` doesn't have `import-sort` key (default: `eslint`).
- `sort-imports.on-save`: enable/disable auto sorting on save (default: `true`).
- `sort-imports.ignore-type-defs`: will not sort `.d.ts` files by default since import-sort doesn't handle them well (default: `true`).
- `sort-imports.languages`: selectively choose the languages which should be sported (default: `['javascript', 'typescript']`).
- `sort-imports.cache-package-json-config-checks`: The sort config is only checked when config files change as a performance optimization, disable if necessary (default: `true`).

### Obsolete settings

See [release notes for version 4](https://github.com/amatiasq/vsc-sort-imports#400)

## Use a different style or parser

Styles (and parsers) can be configured on a per-project basis including support for different types of files (currently JavaScript and TypeScript).

Just add the following to your `package.json` and adapt it to your liking:

```json
"importSort": {
  ".js, .jsx, .es6, .es": {
    "parser": "babylon",
    "style": "eslint",
    "options": {}
  },
  ".ts, .tsx": {
    "parser": "typescript",
    "style": "eslint",
    "options": {}
  }
}
```

The keys are a list of file extensions that map to the parser and style that should be used for files that have any of the listed file extensions.

By default, `sort-import` comes with these styles:

- [`import-sort-style-eslint` (default)](https://github.com/renke/import-sort/tree/master/packages/import-sort-style-eslint): A style that that is compatible with [ESLint's](http://eslint.org/) [sort-imports](https://eslint.org/docs/rules/sort-imports) rule.

- [`import-sort-style-module`](https://github.com/renke/import-sort/tree/master/packages/import-sort-style-module): A style that groups and sorts by module.

- [`import-sort-style-module-compact`](https://github.com/amatiasq/import-sort-style-module-compact): Similar to modules but with fewer groups.

- [`import-sort-style-module-scoped`](https://github.com/cliffkoh/import-sort-style-module-scoped): A style for import-sort that is focused on modules but with scope support.

- [`import-sort-style-renke`](packages/import-sort-style-renke): Renke's
  personal style.

PRs with more styles are welcome.

## Troubleshooting

### `parser.parseImports is not a function`

This happens when using Typescript parser ([import-sort#72](https://github.com/renke/import-sort/issues/72)). The solution is to install it manually:

```
npm i -D import-sort-parser-typescript
```

## Release Notes

### 6.2.1

- Add missing parsers and styles dependencies

### 6.2.0

- Add workspace support with several folders and different configurations

### 6.1.0

- Improve config caching by listening for file changes on config files
- Move from an error toast to a status bar icon and panel. Click the "Sort Imports" text in the lower right to detailed errors.
- Don't sort `.d.ts` files by default since `import-sort` handles them incorrectly (you can disable this feature via the new `sort-imports.ignore-type-defs` configuration option)

### 6.0.2

- Upgrade import-sort to v6

### 6.0.0

- Upgrade dependencies

### 5.1.0

- Add support to importSort additional options [(thanks @fsmaia)](https://github.com/amatiasq/vsc-sort-imports/pull/19)

### 5.0.0

- Breaking change moving to [module-compact v2](https://github.com/amatiasq/import-sort-style-module-compact)

### 4.1.0

- Implemented by [@cliffkoh](https://github.com/cliffkoh)
  - Introduced `sort-imports.default-sort-style`, which defaults to `eslint`. Other possible values are `module`, `module-compact` and `module-scoped`.
  - Introduced `sort-imports.cache-package-json-config-checks` which defaults to `true`. When true, will cache calls to `import-sort-config` thereby improving performance
    (avoids repeated non-trival disk lookups and parsing).
  - Fixed bug in `Save file without sorting import` which caused it to not work.

#### 4.0.0

Update to ease transition from [@peterjuras' extension](https://github.com/peterjuras/vsc-sort-imports).

- `sort-imports.blank-lines-after`: removed until a valid implementation is provided
- `sort-imports.sort-type`: you can now configure your sorting type folowing with a key in your `package.json`. [Documentation](https://github.com/renke/import-sort#using-a-different-style-or-parser)
  - `by-module-name`: is now `"style": "module-compact"`
  - `by-imported-name`: is removed

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
