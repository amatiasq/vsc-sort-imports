import { Range, workspace } from 'vscode';

export const EXTENSION_NAME = 'sort-imports';


export function getConfiguration<T>(key: string): T {
    return workspace.getConfiguration(EXTENSION_NAME).get<T>(key);
}


export function getMaxRange(): Range {
    return new Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
}
