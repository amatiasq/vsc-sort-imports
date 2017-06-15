import { IStyleAPI, IStyleItem } from 'import-sort-style';


export default function(styleApi: IStyleAPI): Array<IStyleItem> {
    const {
        name,
        moduleName,
        isAbsoluteModule,
        isRelativeModule,
        hasNoMember,
        naturally,
    } = styleApi;

    return [
        // import 'foo';
        // import './foo';
        {match: hasNoMember, sort: moduleName(naturally)},

        {separator: true},

        // import ... from 'foo';
        {match: isAbsoluteModule, sort: moduleName(naturally), sortNamedMembers: name(naturally)},

        // import ... from './foo';
        {match: isRelativeModule, sort: moduleName(naturally), sortNamedMembers: name(naturally)},
    ];
}
