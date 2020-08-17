import {
  Disposable,
  OutputChannel,
  StatusBarAlignment,
  StatusBarItem,
  TextEditor,
  commands,
  window,
} from 'vscode';

import { EXTENSION_NAME } from './utils';
import { skipFileSorting } from './sort';

let statusBarItem: StatusBarItem;
let outputChannel: OutputChannel;

const supportedLanguages = [
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
];

export function toggleStatusBarItem(editor: TextEditor | undefined): void {
  if (statusBarItem === undefined) {
    return;
  }

  if (editor !== undefined) {
    // The function will be triggered every time the active "editor" instance changes
    // It also triggers when we focus on the output panel or on the debug panel
    // Both are seen as an "editor".
    // The following check will ignore such panels
    if (
      ['debug', 'output'].some((part) => editor.document.uri.scheme === part)
    ) {
      return;
    }

    const fileName = editor.document.isUntitled
      ? undefined
      : editor.document.fileName;

    const skip = fileName && skipFileSorting(fileName);

    if (!skip && supportedLanguages.includes(editor.document.languageId)) {
      statusBarItem.show();
    } else {
      statusBarItem.hide();
    }
  } else {
    statusBarItem.hide();
  }
}

/**
 * Update the statusBarItem message and show the statusBarItem
 *
 * @param message The message to put inside the statusBarItem
 */
function updateStatusBar(message: string): void {
  statusBarItem.text = message;
  statusBarItem.show();
}

/**
 * Adds the filepath to the error message
 *
 * @param msg The original error message
 * @param fileName The path to the file
 * @returns {string} enhanced message with the filename
 */
function addFilePath(msg: string, fileName: string): string {
  const lines = msg.split('\n');
  if (lines.length > 0) {
    lines[0] = lines[0].replace(/(\d*):(\d*)/g, `${fileName}:$1:$2`);
    return lines.join('\n');
  }

  return msg;
}

/**
 * Append messages to the output channel and format it with a title
 *
 * @param message The message to append to the output channel
 */
export function addToOutput(message: string): void {
  const title = `${new Date().toLocaleString()}:`;

  // Create a sort of title, to differentiate between messages
  outputChannel.appendLine(title);
  outputChannel.appendLine('-'.repeat(title.length));

  // Append actual output
  outputChannel.appendLine(`${message}\n`);
}

/**
 * Execute a callback safely, if it doesn't work, return default and log messages.
 *
 * @param cb The function to be executed,
 * @param defaultText The default value if execution of the cb failed
 * @param fileName The filename of the current document
 * @returns {string} formatted text or defaultText
 */
export function safeExecution(
  cb: () => string,
  defaultText: string | null,
  fileName: string
): string {
  try {
    updateStatusBar('Sort Imports: $(check)');
    return cb();
  } catch (err) {
    addToOutput(addFilePath(err.message, fileName));

    updateStatusBar('Sort Imports: $(x)');
    return defaultText;
  }
}

/**
 * Setup the output channel and the statusBarItem.
 * Create a command to show the output channel
 *
 * @returns {Disposable} The command to open the output channel
 */
export function setupErrorHandler(): Disposable {
  statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, -1);
  statusBarItem.text = 'Sort Imports';
  statusBarItem.command = `${EXTENSION_NAME}.open-output`;

  toggleStatusBarItem(window.activeTextEditor);

  // Setup the outputChannel
  outputChannel = window.createOutputChannel('Sort Imports');

  return commands.registerCommand(`${EXTENSION_NAME}.open-output`, () => {
    outputChannel.show();
  });
}
