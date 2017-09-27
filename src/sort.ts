import importSort from "import-sort";
import { getConfig } from "import-sort-config";
import { dirname, extname } from "path";
import { TextDocument, window } from "vscode";

import styles from "./styles";
import onSave from "./on-save";
import { getConfiguration, getMaxRange } from "./utils";


const findImports = /^import [^\n]+\n\n?/gm;
const defaultLanguages = [
    'javascript',
    'typescript',
];


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
    const styleId = getConfiguration<string>('sort-type') || 'by-module-name';
    let result;

    try {
        const config = getConfig(extension, directory);
        result = importSort(currentText, config.parser, styles[styleId]);
    } catch (exception) {
        if (!getConfiguration<boolean>('suppress-warnings')) {
            window.showWarningMessage(`Error sorting imports: ${exception}`);
        }
        return null;
    }

    return injectBlankLines(result.code);
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


function injectBlankLines(code: string) {
    const blankLines = getConfiguration<number>('blank-lines-after');

    if (!blankLines || !code) {
        return code;
    }

    const imports = code.match(findImports);
    const last = imports[imports.length - 1].trim();
    const inject = '\n'.repeat(blankLines - 1);

    return code
        .split('\n')
        .map(line => line === last ? `${line}${inject}` : line)
        .join('\n');
}