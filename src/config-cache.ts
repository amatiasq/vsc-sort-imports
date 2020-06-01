import {
  DEFAULT_CONFIGS,
  IResolvedConfig,
  getConfig as sortGetConfig
} from 'import-sort-config';
import { TextDocument, WorkspaceFolder, workspace } from 'vscode';
import { dirname, extname } from 'path';

import { getConfiguration } from './utils';

let currentWorkspaceFolder: WorkspaceFolder;
let cachedConfig: IResolvedConfig | null;
const CONFIG_FILES = [
  '.importsortrc',
  '.importsortrc.json',
  '.importsortrc.yaml',
  '.importsortrc.yml',
  '.importsortrc.js',
  'package.json',
  'importsort.config.js'
];

function clearCache() {
  cachedConfig = null;
}

function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

export function fileListener() {
  const fileWatcher = workspace.createFileSystemWatcher(
    `**/{${CONFIG_FILES.join(',')}}`
  );
  fileWatcher.onDidChange(clearCache);
  fileWatcher.onDidCreate(clearCache);
  fileWatcher.onDidDelete(clearCache);
  return fileWatcher;
}

function hasWorkspaceFolderChanged(document: TextDocument): boolean {
  if (!currentWorkspaceFolder) {
    currentWorkspaceFolder = workspace.getWorkspaceFolder(document.uri);
    return false;
  }
  return currentWorkspaceFolder !== workspace.getWorkspaceFolder(document.uri);
}

export function getConfig(document: TextDocument) {
  const useCache = getConfiguration<boolean>(
    'cache-package-json-config-checks'
  );

  const config = clone(DEFAULT_CONFIGS);
  const defaultSortStyle = getConfiguration<string>('default-sort-style');

  Object.keys(config).forEach(key => {
    config[key].style = require.resolve(
      `import-sort-style-${defaultSortStyle}`
    );
  });

  if (!useCache || hasWorkspaceFolderChanged(document) || !cachedConfig) {
    cachedConfig = sortGetConfig(
      extname(document.fileName),
      dirname(document.fileName),
      config
    );
  }

  return cachedConfig;
}
