import sortByImports from './sort-by-imports';
import sortByModule from './sort-by-module';
import { IStyleAPI, IStyleItem } from 'import-sort-style';


export default {
    'by-imported-name': sortByImports,
    'by-module-name': sortByModule,
} as StyleMap;


interface StyleMap {
    [key: string]: StyleParser;
}


type StyleParser = (api: IStyleAPI) => Array<IStyleItem>;
