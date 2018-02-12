import {
    ExtensionContext,
    TextDocument,
    TextEdit,
    commands,
    languages,
    workspace,
} from 'vscode';
import { sort, sortCurrentDocument } from './sort';

import { EXTENSION_NAME } from './utils';

const formatter = {
    provideDocumentFormattingEdits(document: TextDocument): TextEdit[] {
        const result = sort(document);
        const { changes } = result || { changes: [] };

        console.log('FORMATTING', changes);
        return changes; // as any[] as TextEdit[];
    }
};

export function activate({ subscriptions }: ExtensionContext) {
    subscriptions.push(commands.registerCommand(EXTENSION_NAME + '.sort', sortCurrentDocument));
    languages.registerDocumentFormattingEditProvider('javascript', formatter);
    languages.registerDocumentFormattingEditProvider('typescript', formatter);
}

export function deactivate() { }
