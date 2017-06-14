import {IStyleAPI, IStyleItem} from "import-sort-style";

export default function(styleApi: IStyleAPI): Array<IStyleItem> {
  const {
    and,
    hasDefaultMember,
    hasNamedMembers,
    hasNamespaceMember,
    hasNoMember,
    hasOnlyDefaultMember,
    hasOnlyNamedMembers,
    hasOnlyNamespaceMember,
    isAbsoluteModule,
    isRelativeModule,
    member,
    moduleName,
    name,
    not,
    startsWithAlphanumeric,
    startsWithLowerCase,
    startsWithUpperCase,
    naturally,
  } = styleApi;

  return [
    // import "foo"
    {match: and(hasNoMember, isAbsoluteModule), sort: moduleName(naturally)},
    // import "./foo"
    {match: and(hasNoMember, isRelativeModule), sort: moduleName(naturally)},

    {separator: true},

    {match: isAbsoluteModule, sort: moduleName(naturally)},

    {separator: true},

    {match: isRelativeModule, sort: moduleName(naturally)},
  ];
}