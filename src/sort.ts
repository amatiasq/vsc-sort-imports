'use strict';
import {
    Position,
    Range,
    TextDocument,
    window,
    workspace,
    WorkspaceEdit
} from 'vscode';
const importSort = require('import-sort');

function sort(document: TextDocument): string {
    if (!document.languageId.startsWith('javascript')) {
        return;
    }

    const currentText = document.getText();
    try {
        return importSort(currentText);
    } catch (exception) {
        window.showWarningMessage(`Could not sort imports. - ${exception}`);
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

export function sortImportsOnSave(document: TextDocument) {
    if (!workspace.getConfiguration("sortImports").get("onSave")) {
        return;
    }

    if (document['sortedImports']) {
        delete document['sortedImports'];
        return;
    }

    const sortedText = sort(document);
    if (!sortedText) {
        return;
    }

    document['sortedImports'] = true;
    const workspaceEdit = new WorkspaceEdit();
    workspaceEdit.replace(document.uri, getMaxRange(), sortedText);
    return workspace.applyEdit(workspaceEdit)
        .then(() => document.save());
}
