import importSort from "import-sort";
import { getConfig } from "import-sort-config";
import { dirname, extname } from "path";
import { TextDocument, window } from "vscode";

import onSave from "./on-save";
import styles from "./styles";
import { getConfiguration, getMaxRange } from "./utils";


const validLanguages = /^(java|type)script(react)*$/;


export function sort(document: TextDocument): string {
    if (!document.languageId.match(validLanguages)) {
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

    // Last change contains the new import section
    const change = result.changes.pop()
    const blankLines = getConfiguration<number>('blank-lines-after');

    if (blankLines) {
        if (change) {
            const length = change.code.length;
            const before = result.code.substr(0, length);
            const after = result.code.substr(length);
            result.code = before + '\n'.repeat(blankLines - 1) + after;
        } else {
            // TODO: When imports are not modified we should check the
            //   blank lines after the imports section.
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
    onSave.bypass(async () => await document.save());
}


