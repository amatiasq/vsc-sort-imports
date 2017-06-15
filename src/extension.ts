import onSave from './on-save';
import { saveWithoutSorting, sortCurrentDocument } from './sort';
import {
    ExtensionContext,
    commands,
    workspace,
} from 'vscode';


export function activate({ subscriptions }: ExtensionContext) {
    subscriptions.push(commands.registerCommand('amqSortImports.sort', sortCurrentDocument));
    subscriptions.push(commands.registerCommand('amqSortImports.saveWithoutSorting', saveWithoutSorting));

    onSave.update();
    workspace.onDidChangeConfiguration(() => onSave.update());
}

export function deactivate() { }
