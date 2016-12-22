import { Disposable, workspace } from 'vscode';

import { sortImportsOnSave } from './sort';

let saveRegistration : Disposable;

export function unregisterWillSaveTextDocument() {
  if (!saveRegistration) {
    return;
  }

  saveRegistration.dispose();
  saveRegistration = null;
}

export function registerWillSaveTextDocument() {
  if (saveRegistration) {
    return;
  }

  saveRegistration = workspace.onWillSaveTextDocument(sortImportsOnSave);
}

export function updateSaveRegistration() {
    if (workspace.getConfiguration("sortImports").get("onSave")) {
        registerWillSaveTextDocument();
    } else {
        unregisterWillSaveTextDocument();
    }
}
