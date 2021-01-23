import {
  DEFAULT_CONFIGS,
  IResolvedConfig,
  getConfig as sortGetConfig,
} from 'import-sort-config';
import {
  FileSystemWatcher,
  TextDocument,
  WorkspaceFolder,
  workspace,
} from 'vscode';
import { clone, getConfiguration } from './utils';
import { dirname, extname } from 'path';

let currentWorkspaceFolder: WorkspaceFolder;
let cachedConfig: IResolvedConfig | null;
const CONFIG_FILES = [
  '.importsortrc',
  '.importsortrc.json',
  '.importsortrc.yaml',
  '.importsortrc.yml',
  '.importsortrc.js',
  'package.json',
  'importsort.config.js',
];

function clearCache() {
  cachedConfig = null;
}

export function fileListener(): FileSystemWatcher {
  const fileWatcher = workspace.createFileSystemWatcher(
    `**/{${CONFIG_FILES.join(',')}}`
  );
  fileWatcher.onDidChange(clearCache);
  fileWatcher.onDidCreate(clearCache);
  fileWatcher.onDidDelete(clearCache);
  return fileWatcher;
}

function hasWorkspaceFolderChanged(document: TextDocument): boolean {
  if (!workspace.workspaceFolders || workspace.workspaceFolders.length < 2) {
    return false;
  }
  if (
    JSON.stringify(currentWorkspaceFolder) !==
    JSON.stringify(workspace.getWorkspaceFolder(document.uri))
  ) {
    currentWorkspaceFolder = workspace.getWorkspaceFolder(document.uri);
    return true;
  }
  return false;
}

export function getConfig(document: TextDocument): IResolvedConfig {
  const useCache = getConfiguration<boolean>(
    'cache-package-json-config-checks'
  );

  const config = clone(DEFAULT_CONFIGS);
  const defaultSortStyle = getConfiguration<string>('default-sort-style');

  Object.keys(config).forEach((key) => {
    config[key].style = require.resolve(
      `import-sort-style-${defaultSortStyle}`
    );
  });

  // Initialize reference to the document current workspace folder
  if (!currentWorkspaceFolder) {
    currentWorkspaceFolder = workspace.getWorkspaceFolder(document.uri);
  }

  if (!useCache || !cachedConfig || hasWorkspaceFolderChanged(document)) {
    cachedConfig = sortGetConfig(
      extname(document.fileName),
      dirname(document.fileName),
      config
    );
  }

  return cachedConfig;
}
