import { ExtensionContext, commands, workspace } from 'vscode';
import { fileListener } from './config-cache';
import onSave from './on-save';
import { saveWithoutSorting, sortCurrentDocument } from './sort';
import { EXTENSION_NAME } from './utils';

export function activate({ subscriptions }: ExtensionContext) {
  subscriptions.push(
    commands.registerCommand(EXTENSION_NAME + '.sort', sortCurrentDocument)
  );
  subscriptions.push(
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
