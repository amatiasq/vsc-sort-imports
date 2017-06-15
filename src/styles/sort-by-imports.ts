import { IStyleAPI, IStyleItem } from "import-sort-style";


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
        {match: and(hasNoMember, isAbsoluteModule)},
        // import "./foo"
        {match: and(hasNoMember, isRelativeModule)},

        {separator: true},

        // import * as _ from "bar";
        {match: and(hasOnlyNamespaceMember, isAbsoluteModule, not(member(startsWithAlphanumeric))), sort: moduleName(naturally)},
        // import * as Foo from "bar";
        {match: and(hasOnlyNamespaceMember, isAbsoluteModule), sort: moduleName(naturally)},

        // import _, * as bar from "baz";
        {match: and(hasDefaultMember, hasNamespaceMember, isAbsoluteModule, not(member(startsWithAlphanumeric))), sort: moduleName(naturally)},
        // import Foo, * as bar from "baz";
        {match: and(hasDefaultMember, hasNamespaceMember, isAbsoluteModule), sort: moduleName(naturally)},

        // import _ from "bar";
        {match: and(hasOnlyDefaultMember, isAbsoluteModule, not(member(startsWithAlphanumeric))), sort: moduleName(naturally)},
        // import Foo from "bar";
        {match: and(hasOnlyDefaultMember, isAbsoluteModule), sort: moduleName(naturally)},

        // import _, {bar, …} from "baz";
        {match: and(hasDefaultMember, hasNamedMembers, isAbsoluteModule, not(member(startsWithAlphanumeric))), sort: moduleName(naturally), sortNamedMembers: name(naturally)},
        // import Foo, {bar, …} from "baz";
        {match: and(hasDefaultMember, hasNamedMembers, isAbsoluteModule), sort: moduleName(naturally), sortNamedMembers: name(naturally)},

        // import {_, bar, …} from "baz";
        {match: and(hasOnlyNamedMembers, isAbsoluteModule, not(member(startsWithAlphanumeric))), sort: moduleName(naturally), sortNamedMembers: name(naturally)},
        // import {Foo, bar, …} from "baz";
        {match: and(hasOnlyNamedMembers, isAbsoluteModule), sort: moduleName(naturally), sortNamedMembers: name(naturally)},

        {separator: true},

        // import * as _ from "./bar";
        {match: and(hasOnlyNamespaceMember, isRelativeModule, not(member(startsWithAlphanumeric))), sort: moduleName(naturally)},
        // import * as Foo from "./bar";
        {match: and(hasOnlyNamespaceMember, isRelativeModule), sort: moduleName(naturally)},

        // import _, * as bar from "./baz";
        {match: and(hasDefaultMember, hasNamespaceMember, isRelativeModule, not(member(startsWithAlphanumeric))), sort: moduleName(naturally)},
        // import Foo, * as bar from "./baz";
        {match: and(hasDefaultMember, hasNamespaceMember, isRelativeModule), sort: moduleName(naturally)},

        // import _ from "./bar";
        {match: and(hasOnlyDefaultMember, isRelativeModule, not(member(startsWithAlphanumeric))), sort: moduleName(naturally)},
        // import Foo from "./bar";
        {match: and(hasOnlyDefaultMember, isRelativeModule), sort: moduleName(naturally)},

        // import _, {bar, …} from "./baz";
        {match: and(hasDefaultMember, hasNamedMembers, isRelativeModule, not(member(startsWithAlphanumeric))), sort: moduleName(naturally), sortNamedMembers: name(naturally)},
        // import Foo, {bar, …} from "./baz";
        {match: and(hasDefaultMember, hasNamedMembers, isRelativeModule), sort: moduleName(naturally), sortNamedMembers: name(naturally)},

        // import {_, bar, …} from "./baz";
        {match: and(hasOnlyNamedMembers, isRelativeModule, not(member(startsWithAlphanumeric))), sort: moduleName(naturally), sortNamedMembers: name(naturally)},
        // import {Foo, bar, …} from "./baz";
        {match: and(hasOnlyNamedMembers, isRelativeModule), sort: moduleName(naturally), sortNamedMembers: name(naturally)},

        {separator: true},
    ];
}