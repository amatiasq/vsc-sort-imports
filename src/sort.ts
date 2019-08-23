import { dirname, extname } from 'path';
import importSort from 'import-sort';
import { TextDocument, window } from 'vscode';
import { getConfig } from './config-cache';
import onSave from './on-save';
import { getConfiguration, getMaxRange } from './utils';

const defaultLanguages = ['javascript', 'typescript'];

export function sort(document: TextDocument): string {
  const languages = getConfiguration<string[]>('languages') || defaultLanguages;
  const skipTypeDefs = getConfiguration<boolean>('ignore-type-defs');

  const isValidLanguage = languages.some(language =>
    document.languageId.includes(language)
  );

  if (!isValidLanguage) {
    return;
  }

  const currentText = document.getText();
  const fileName = document.fileName;
  const extension = extname(fileName);
  const directory = dirname(fileName);

  if (skipTypeDefs && fileName.endsWith('.d.ts')) {
    return;
  }

  try {
    const {
      parser,
      style,
      config: { options }
    } = getConfig(extension, directory);

    const result = importSort(currentText, parser, style, fileName, options);
    return result.code;
  } catch (exception) {
    if (!getConfiguration<boolean>('suppress-warnings')) {
      window.showWarningMessage(`Error sorting imports: ${exception}`);
    }

    return null;
  }
}

export function sortCurrentDocument() {
  const {
    activeTextEditor: editor,
    activeTextEditor: { document }
  } = window;

  const sortedText = sort(document);
  if (!sortedText) {
    return;
  }

  return editor.edit(edit => edit.replace(getMaxRange(), sortedText));
}

export async function saveWithoutSorting() {
  const { document } = window.activeTextEditor;
  onSave.bypass(async () => await document.save());
}
