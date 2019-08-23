import { ExtensionContext, commands, window, workspace } from 'vscode';
import { fileListener } from './config-cache';
import { setupErrorHandler, toggleStatusBarItem } from './errorHandler';
import onSave from './on-save';
import { saveWithoutSorting, sortCurrentDocument } from './sort';
import { EXTENSION_NAME } from './utils';

export function activate({ subscriptions }: ExtensionContext) {
  subscriptions.push(
    commands.registerCommand(EXTENSION_NAME + '.sort', sortCurrentDocument),
    commands.registerCommand(
      `${EXTENSION_NAME}.save-without-sorting`,
      saveWithoutSorting
    ),
    fileListener(),
    setupErrorHandler(),
    window.onDidChangeActiveTextEditor(editor => {
      toggleStatusBarItem(editor);
    })
  );

  onSave.update();
  workspace.onDidChangeConfiguration(() => onSave.update());
}

export function deactivate() {}
