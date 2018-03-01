import importSort from 'import-sort';
import { DEFAULT_CONFIGS, getConfig } from 'import-sort-config';
import { dirname, extname } from 'path';
import { TextDocument, window } from 'vscode';
import onSave from './on-save';
import { getConfiguration, getMaxRange } from './utils';

// const findImports = /^import [^\n]+\n+/gm;
const defaultLanguages = [
    'javascript',
    'typescript',
];

let cachedParser: string;
let cachedStyle: string;
let cachedOptions: object;


export function sort(document: TextDocument): string {
    const languages = getConfiguration<string[]>('languages') || defaultLanguages;
    const isValidLanguage = languages.some(language => document.languageId.includes(language));

    if (!isValidLanguage) {
        return;
    }

    const currentText = document.getText();
    const fileName = document.fileName;
    const extension = extname(fileName);
    const directory = dirname(fileName);

    let result;
    const config = clone(DEFAULT_CONFIGS);
    const defaultSortStyle = getConfiguration<string>('default-sort-style');

    for (const languages of Object.keys(config)) {
        config[languages].style = defaultSortStyle;
    }

    const useCache = getConfiguration<boolean>('cache-package-json-config-checks');

    try {
        if (!useCache || !cachedParser) {
            const { parser, style, config: { options } } = getConfig(extension, directory, config);
            cachedParser = parser;
            cachedStyle = style;
            cachedOptions = options;
        }

        const result = importSort(currentText, cachedParser, cachedStyle, fileName, cachedOptions);
        return result.code;

    } catch (exception) {
        if (!getConfiguration<boolean>('suppress-warnings')) {
            window.showWarningMessage(`Error sorting imports: ${exception}`);
        }

        return null;
    }
}


export function sortCurrentDocument() {
    const {
        activeTextEditor: editor,
        activeTextEditor: { document }
    } = window;

    const sortedText = sort(document);
    if (!sortedText) {
        return;
    }

    return editor.edit(edit => edit.replace(getMaxRange(), sortedText));
}


export async function saveWithoutSorting() {
    const { document } = window.activeTextEditor;
    onSave.bypass(async () => await document.save());
}


function clone(object) {
    return JSON.parse(JSON.stringify(object));
}
