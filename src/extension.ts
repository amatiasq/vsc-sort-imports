import {
    commands,
    ExtensionContext,
    workspace,
} from "vscode";

import onSave from "./on-save";
import { saveWithoutSorting, sortCurrentDocument } from "./sort";
import { EXTENSION_NAME } from "./utils";


export function activate({ subscriptions }: ExtensionContext) {
    subscriptions.push(commands.registerCommand(EXTENSION_NAME + '.sort', sortCurrentDocument));
    subscriptions.push(commands.registerCommand(EXTENSION_NAME + '.save-without-sorting', saveWithoutSorting));

    onSave.update();
    workspace.onDidChangeConfiguration(() => onSave.update());
}

export function deactivate() { }
