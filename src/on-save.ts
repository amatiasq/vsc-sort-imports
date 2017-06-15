import { sort } from './sort';
import { getConfiguration, getMaxRange }  from './utils';
import {
    Disposable,
    workspace,
    TextDocumentWillSaveEvent,
    TextEdit,
} from 'vscode';


let subscription: Disposable;


export default {

    get isEnabled() {
        return getConfiguration('onSave');
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
        } else {
            this.unregister();
        }
    },
};


function listener({ document, waitUntil }: TextDocumentWillSaveEvent) {
    const sortedText = sort(document);
    if (!sortedText) {
        return;
    }

    const edits = Promise.resolve([ new TextEdit(getMaxRange(), sortedText) ]);
    waitUntil(edits);
}
