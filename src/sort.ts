'use strict';

import {
    getOnSaveSetting,
    registerWillSaveTextDocument,
    unregisterWillSaveTextDocument,
} from './registration';
import myStyle from './style';
import { getConfig } from 'import-sort-config';
import importSort from 'import-sort';
import { dirname, extname } from 'path';
import {
    Range,
    TextDocument,
    TextDocumentWillSaveEvent,
    TextEdit,
    TextEditor,
    window,
    workspace,
} from 'vscode';

function sort(document: TextDocument): string {
    const languageRegex = /^(java|type)script(react)*$/;
    if (!document.languageId.match(languageRegex)) {
        return;
    }

    const currentText = document.getText();

    const fileName = document.fileName;
    const extension = extname(fileName);
    const directory = dirname(fileName);

    try {
        const config = getConfig(extension, directory);
        const result = importSort(currentText, config.parser, myStyle);
        const change = result.changes[0];

        if (change) {
            const before = result.code.substr(0, change.end);
            const after = result.code.substr(change.end);
            result.code = before + '\n' + after;
        }

        return result.code;
    } catch (exception) {
        if (!workspace.getConfiguration("sortImports").get("suppressWarnings")) {
            window.showWarningMessage(`Could not sort imports. - ${exception}`);
        }
        return null;
    }
}

function getMaxRange(): Range {
    return new Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
}

export function sortImports() {
    const {
        activeTextEditor: editor,
        activeTextEditor: { document }
    } = window;

    const sortedText = sort(document);
    if (!sortedText) {
        return;
    }

    return editor.edit(edit => {
        edit.replace(getMaxRange(), sortedText);
    });
}

export function sortImportsOnSave({ document, waitUntil }: TextDocumentWillSaveEvent) {
    const sortedText = sort(document);
    if (!sortedText) {
        return;
    }

    const edits = Promise.resolve([new TextEdit(getMaxRange(), sortedText)]);
    waitUntil(edits);
}

export async function saveWithoutSorting() {
    const { document } = window.activeTextEditor;

    unregisterWillSaveTextDocument();
    await document.save();
    if (getOnSaveSetting()) {
        registerWillSaveTextDocument();
    }
}
