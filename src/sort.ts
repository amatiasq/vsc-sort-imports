'use strict';

import {
    Range,
    TextDocument,
    TextDocumentWillSaveEvent,
    window,
    workspace,
} from 'vscode';
import { dirname, extname } from 'path';
import { registerWillSaveTextDocument, unregisterWillSaveTextDocument } from './registration';

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

function getMaxRange() : Range {
    return new Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
}

export function sortImports(doc = null) {
    const { activeTextEditor: editor } = window;
    const document = doc || editor.document;

    const sortedText = sort(document);
    if (!sortedText) {
        return;
    }

    return editor.edit(edit => {
        edit.replace(getMaxRange(), sortedText);
    });
}

export function sortImportsOnSave({ document }: TextDocumentWillSaveEvent) {
    return sortImports(document);
}

export async function saveWithoutSorting() {
    const { document } = window.activeTextEditor;

    unregisterWillSaveTextDocument();
    await document.save();
    registerWillSaveTextDocument();
}
