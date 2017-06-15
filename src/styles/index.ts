import { IStyleAPI, IStyleItem } from "import-sort-style";

import sortByImports from "./sort-by-imports";
import sortByModule from "./sort-by-module";


export default {
    'by-imported-name': sortByImports,
    'by-module-name': sortByModule,
} as StyleMap;


interface StyleMap {
    [key: string]: StyleParser;
}


type StyleParser = (api: IStyleAPI) => Array<IStyleItem>;
