'use strict';

import {
    Range,
    TextDocument,
    TextDocumentWillSaveEvent,
    TextEdit,
    TextEditor,
    window,
    workspace,
} from 'vscode';
import { dirname, extname } from 'path';
import {
    getOnSaveSetting,
    registerWillSaveTextDocument,
    unregisterWillSaveTextDocument,
} from './registration';

import { getConfig } from 'import-sort-config';
import importSort from 'import-sort';

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
        return importSort(currentText, config.parser, config.style).code;
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
