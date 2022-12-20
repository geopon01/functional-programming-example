// npx tsc -w
console.log('\n', '\n', '\n');

interface User {
  name: string;
  surname: string;
}

const printUserName = (user: User) => console.log(user.name);

const user: User = { name: 'some name', surname: 'some surname' };

printUserName(user);

/**
 * Unlike OOP types are just a description.
 * If a subset satisfies what you need, the type doesn't care
 */

const printUserName2 = (user: { name: string }) => console.log(user.name);

/**
 * The input required exists in User, so an object of type User can be used
 */
printUserName2(user);

enum Kind {
  KIND1 = 'kind1',
  KIND2 = 'kind2',
  KIND3 = 'kind3',
}

type Message = { request: string; kind: Kind; data: number[] };

const getPositiveValues = (data: number[]) => data.filter((d) => d > 0);

/**
 * Different message type
 */
type Message2 = { author: string; data: number[] };

/**
 * UNION
 * We can create a UNION of types so we can be more abstract and handle them as the same thing (for the parts that overlap (common between union types))
 */
type MessageBase = Message | Message2;

const processMessageData = (messages: MessageBase[]) => messages.map((m) => console.log(getPositiveValues(m.data)));

/**
 * INTERSECTION
 * Pull all the properties together to create a new type
 */

type MessageIntersection = Message & Message2;

const messageIntersectionObject: MessageIntersection = {
  request: 'request',
  kind: Kind.KIND1,
  data: [],
  author: 'author',
};

/**
 * PICK
 * You can pick properties from different types and build a new one
 */

type Message3 = User & Pick<Message, 'data' | 'kind'>;

const message3Object: Message3 = {
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
