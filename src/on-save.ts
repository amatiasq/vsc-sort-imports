import {
  Disposable,
  TextDocument,
  TextDocumentWillSaveEvent,
  TextEdit,
  TextEditorEdit,
  window,
  workspace,
} from 'vscode';
import { getConfiguration, getMaxRange } from './utils';

import { sort } from './sort';

let subscription: Disposable;

export default class OnSave {
  private static get isEnabled(): boolean {
    return getConfiguration<boolean>('on-save');
  }

  static register(): void {
    if (subscription) {
      return;
    }

    subscription = workspace.onWillSaveTextDocument(OnSave.listener.bind(this));
  }

  static unregister(): void {
    if (!subscription) {
      return;
    }

    subscription.dispose();
    subscription = null;
  }

  static update(): void {
    if (OnSave.isEnabled) {
      OnSave.register();
    } else {
      OnSave.unregister();
    }
  }

  static bypass(action: () => Thenable<boolean>): Thenable<boolean> {
    OnSave.unregister();
    const result = action();
    return result.then((res) => {
      OnSave.update();
      return res;
    });
  }

  private static listener({ document, waitUntil }: TextDocumentWillSaveEvent) {
    const sortedText = sort(document);
    if (!sortedText) {
      return;
    }

    waitUntil(OnSave.changeContentOfDocument(document, sortedText));
  }

  private static changeContentOfDocument(document: TextDocument, sortedText) {
    const editor = window.activeTextEditor;
    const savingActiveDocument = document === editor.document;

    const maxRange = getMaxRange();

    if (savingActiveDocument) {
      return editor.edit((edit: TextEditorEdit) => {
        edit.replace(maxRange, sortedText);
      });
    }

    return Promise.resolve([new TextEdit(maxRange, sortedText)]);
  }
}
