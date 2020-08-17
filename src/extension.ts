import { ExtensionContext, commands, window, workspace } from 'vscode';
import { saveWithoutSorting, sortCurrentDocument } from './sort';
import { setupErrorHandler, toggleStatusBarItem } from './errorHandler';

import { EXTENSION_NAME } from './utils';
import { fileListener } from './config-cache';
import onSave from './on-save';

export function activate({ subscriptions }: ExtensionContext) {
  subscriptions.push(
    commands.registerCommand(EXTENSION_NAME + '.sort', sortCurrentDocument),
    commands.registerCommand(
      `${EXTENSION_NAME}.save-without-sorting`,
      saveWithoutSorting
    ),
    fileListener(),
    setupErrorHandler(),
    window.onDidChangeActiveTextEditor((editor) => {
      toggleStatusBarItem(editor);
    })
  );

  onSave.update();
  workspace.onDidChangeWorkspaceFolders(() => onSave.update());
  workspace.onDidChangeConfiguration(() => onSave.update());
}

export function deactivate() {}
