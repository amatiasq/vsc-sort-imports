import {
    Disposable,
    TextDocumentWillSaveEvent,
    TextEdit,
    workspace,
} from "vscode";

import { sort } from "./sort";
import { getConfiguration, getMaxRange }  from "./utils";


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
        } else {
            this.unregister();
        }
    },

    bypass(action) {
        this.unregister();
        const result = action();
        this.update();
        return result;
    }
};


function listener({ document, waitUntil }: TextDocumentWillSaveEvent) {
    const sortedText = sort(document);
    if (!sortedText) {
        return;
    }

    const edits = Promise.resolve([ new TextEdit(getMaxRange(), sortedText) ]);
    waitUntil(edits);
}
