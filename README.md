# amq-sort-imports

A for from [`sort-imports`](https://github.com/peterjuras/vsc-sort-imports.git) to add features.

# sort-imports

Sort ES6 imports for JavaScript and TypeScript automatically. Ported from the [atom-import-sort](https://atom.io/packages/atom-import-sort) package by [Renke Grunwald](https://github.com/renke).

![Sort Example](http://i.imgur.com/XEzc7EU.gif)

## Features

Automatically sorts imports on save. You can disable this behavior in the settings and sort imports manually:

1. Launch the Command Palette (`Ctrl/Cmd + Shift + P`);
2. Enter **Sort imports**

You can also save the document without saving imports. This could become handy when you have auto saving enabled, but don't want to sort the imports in a particular file:

1. Launch the Command Palette (`Ctrl/Cmd + Shift + P`);
2. Enter **Save file without sorting imports**

## Extension Settings

This extension has the following settings:

* `sortImports.onSave`: enable/disable auto sorting on save (default: true)
* `sortImports.suppressWarnings`: suppress warnings if sorting imports fails (default: false)

## Release Notes

#### 2.4.0

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

## Thanks

- Special thanks to [Renke Grunwald](https://github.com/renke) for creating the [import-sort](https://github.com/renke/import-sort) module!
- Icon made by [Catalin Fertu](http://www.flaticon.com/authors/catalin-fertu) from [www.flaticon.com]()
