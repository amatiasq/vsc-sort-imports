'use strict';

import {
    Position,
    Range,
    TextDocument,
    TextDocumentWillSaveEvent,
    WorkspaceEdit,
    window,
    workspace,
} from 'vscode';
import {dirname, extname} from 'path';

import {getConfig} from 'import-sort-config';
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

export function sortImports() {
    const { activeTextEditor: editor } = window;
    const { document } = editor;
    const sortedText = sort(document);
    if (!sortedText) {
        return;
    }

    editor.edit(edit => {
        edit.replace(getMaxRange(), sortedText);
    });
}

export function saveWithoutSorting() {
    const { activeTextEditor: editor } = window;
    const { document } = editor;
    document['sortedImports'] = true;
    document.save();
}

export function sortImportsOnSave({ document }: TextDocumentWillSaveEvent) {
    if (!workspace.getConfiguration("sortImports").get("onSave")) {
        return;
    }

    const sortedText = sort(document);
    if (!sortedText) {
        return;
    }

    const workspaceEdit = new WorkspaceEdit();
    workspaceEdit.replace(document.uri, getMaxRange(), sortedText);
    return workspace.applyEdit(workspaceEdit)
        .then(() => document.save());
}
