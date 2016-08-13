'use strict';
import {
    commands,
    ExtensionContext,
    workspace
} from 'vscode';
import { saveWithoutSorting, sortImports, sortImportsOnSave } from './sort';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand('sortImports.sort', () => {
        sortImports();
    }));

    context.subscriptions.push(commands.registerCommand('sortImports.saveWithoutSorting', () => {
        saveWithoutSorting();
    }));

    workspace.onDidSaveTextDocument(sortImportsOnSave);
}

export function deactivate() { }
