"use strict";
// npx tsc -w
console.log('\n', '\n', '\n');
const printUserName = (user) => console.log(user.name);
const user = { name: 'some name', surname: 'some surname' };
printUserName(user);
/**
 * Unlike OOP types are just a description.
 * If a subset satisfies what you need, the type doesn't care
 */
const printUserName2 = (user) => console.log(user.name);
/**
 * The input required exists in User, so an object of type User can be used
 */
printUserName2(user);
var Kind;
(function (Kind) {
    Kind["KIND1"] = "kind1";
    Kind["KIND2"] = "kind2";
    Kind["KIND3"] = "kind3";
})(Kind || (Kind = {}));
const getPositiveValues = (data) => data.filter((d) => d > 0);
const processMessageData = (messages) => messages.map((m) => console.log(getPositiveValues(m.data)));
const messageIntersectionObject = {
    request: 'request',
    kind: Kind.KIND1,
    data: [],
    author: 'author',
};
const message3Object = {
    name: 'name',
    surname: 'surname',
    data: [],
    kind: Kind.KIND2,
};
console.log('\n', '\n', '\n');
// const a = (): void => b();
// const b = (): void => c();
// const c = (): void => a();
// a();
//# sourceMappingURL=index.js.map