import {
  DEFAULT_CONFIGS,
  IResolvedConfig,
  getConfig as sortGetConfig
} from 'import-sort-config';

import { getConfiguration } from './utils';
import { workspace } from 'vscode';

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

export function getConfig(extension: string, directory: string) {
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

  if (!useCache || !cachedConfig) {
    cachedConfig = sortGetConfig(extension, directory, config);
  }

  return cachedConfig;
}
