'use strict';
import {
    commands,
    ExtensionContext,
    workspace
} from 'vscode';
import { sortImports, sortImportsOnSave } from './sort';

export function activate(context: ExtensionContext) {
    const menuCommand = commands.registerCommand('sortImports.sort', () => {
        sortImports();
    });
    workspace.onDidSaveTextDocument(sortImportsOnSave);
    context.subscriptions.push(menuCommand);
}

export function deactivate() { }
