import {
    Disposable,
    TextDocumentWillSaveEvent,
    workspace,
    window,
    TextEditorEdit,
    TextDocument,
    TextEdit,
} from 'vscode';
import { sort } from './sort';
import { getConfiguration, getMaxRange } from './utils';

let subscription: Disposable;


export default {

    get isEnabled() {
        return getConfiguration<boolean>('on-save');
    },

    register() {
        if (subscription) {
            return;
        }

        subscription = workspace.onWillSaveTextDocument(listener);
    },

    unregister() {
        if (!subscription) {
            return;
        }

        subscription.dispose();
        subscription = null;
    },

    update() {
        if (this.isEnabled) {
            this.register();
        } else {
            this.unregister();
        }
    },

    bypass(action) {
        this.unregister();
        const result = action();
        return result.then((res) => {
            this.update();
            return res;
        });
    }
};


function listener({ document, waitUntil }: TextDocumentWillSaveEvent) {
    const sortedText = sort(document);
    if (!sortedText) {
        return;
    }

    waitUntil(changeContentOfDocument(document, sortedText));
}

function changeContentOfDocument(document: TextDocument, sortedText) {
    const editor = window.activeTextEditor;
    const savingActiveDocument = document === editor.document;

    const maxRange = getMaxRange();

    if (savingActiveDocument) {
        return editor.edit((edit: TextEditorEdit) => {
            edit.replace(maxRange, sortedText);
        });
    }

    return Promise.resolve([new TextEdit(maxRange, sortedText)]);
};

