import { workspace, Range } from 'vscode';


export function getConfiguration(key: string)  {
    return workspace.getConfiguration('amqSortImports').get(key);
}


export function getMaxRange(): Range {
    return new Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
}
