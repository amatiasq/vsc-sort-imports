import onSave from './on-save';
import styles from './styles';
import { getConfiguration, getMaxRange } from './utils';
import { getConfig } from 'import-sort-config';
import importSort from 'import-sort';
import { dirname, extname } from 'path';
import { TextDocument, window } from 'vscode';


const validLanguages = /^(java|type)script(react)*$/;


export function sort(document: TextDocument): string {
    if (!document.languageId.match(validLanguages)) {
        return;
    }

    const currentText = document.getText();
    const fileName = document.fileName;
    const extension = extname(fileName);
    const directory = dirname(fileName);
    const styleId = getConfiguration('sortType') as string || 'by-module-name';
    let result;

    try {
        const config = getConfig(extension, directory);
        result = importSort(currentText, config.parser, styles[styleId]);
    } catch (exception) {
        if (!getConfiguration('suppressWarnings')) {
            window.showWarningMessage(`Error sorting imports: ${exception}`);
        }
        return null;
    }

    // Last change contains the new import section
    const change = result.changes.pop()
    const blankLines = parseInt(getConfiguration('blankLinesAfter') as string, 10);

    if (blankLines) {
        if (change) {
            const length = change.code.length;
            const before = result.code.substr(0, length);
            const after = result.code.substr(length);
            result.code = before + '\n'.repeat(blankLines - 1) + after;
        } else {
            // TODO
        }
    }

    return result.code;
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

    onSave.unregister();
    await document.save();
    if (onSave.isEnabled) {
        onSave.register();
    }
}


