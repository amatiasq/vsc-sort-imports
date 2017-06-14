'use strict';

import {
    ExtensionContext,
    commands,
    workspace,
} from 'vscode';
import {
    saveWithoutSorting,
    sortImports,
} from './sort';

import { updateSaveRegistration } from './registration';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand('sortImports.sort', sortImports));
    context.subscriptions.push(commands.registerCommand('sortImports.saveWithoutSorting', saveWithoutSorting));

    updateSaveRegistration();
    workspace.onDidChangeConfiguration(updateSaveRegistration);
}

export function deactivate() { }
