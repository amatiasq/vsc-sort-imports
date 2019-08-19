import {
  Disposable,
  OutputChannel,
  StatusBarAlignment,
  StatusBarItem,
  TextEditor,
  commands,
  languages,
  window
} from 'vscode';
import { EXTENSION_NAME } from './utils';

let outputChannel: OutputChannel;

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
    return cb();
  } catch (err) {
    addToOutput(addFilePath(err.message, fileName));

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
  // Setup the outputChannel
  outputChannel = window.createOutputChannel('Sort Imports');

  return commands.registerCommand(`${EXTENSION_NAME}.open-output`, () => {
    outputChannel.show();
  });
}
