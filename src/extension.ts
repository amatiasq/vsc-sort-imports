import { ExtensionContext, commands, workspace } from 'vscode';
<<<<<<< HEAD
import { fileListener } from './config-cache';
=======
import { setupErrorHandler } from './errorHandler';
>>>>>>> feat: add output panel for errors instead of toast
import onSave from './on-save';
import { saveWithoutSorting, sortCurrentDocument } from './sort';
import { EXTENSION_NAME } from './utils';

export function activate({ subscriptions }: ExtensionContext) {
  subscriptions.push(
    commands.registerCommand(EXTENSION_NAME + '.sort', sortCurrentDocument)
  );
  subscriptions.push(
    setupErrorHandler(),
    commands.registerCommand(
      EXTENSION_NAME + '.save-without-sorting',
      saveWithoutSorting
    ),
    fileListener()
  );

  onSave.update();
  workspace.onDidChangeConfiguration(() => onSave.update());
}

export function deactivate() {}
