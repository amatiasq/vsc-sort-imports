'use strict';

import {
    ExtensionContext,
    commands,
    workspace,
} from 'vscode';
import { saveWithoutSorting, sortImports, sortImportsOnSave } from './sort';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand('sortImports.sort', () => {
        sortImports();
    }));

    context.subscriptions.push(commands.registerCommand('sortImports.saveWithoutSorting', () => {
        saveWithoutSorting();
    }));

    workspace.onWillSaveTextDocument(sortImportsOnSave);
}

export function deactivate() { }
