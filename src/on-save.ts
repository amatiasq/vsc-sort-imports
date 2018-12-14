import {
    Disposable,
    TextDocumentWillSaveEvent,
    workspace,
    window,
    TextEditorEdit,
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

    const editor = window.activeTextEditor;

    const editPromise = editor.edit((edit: TextEditorEdit) => {
        edit.replace(getMaxRange(), sortedText);
    });

    waitUntil(editPromise);
}
