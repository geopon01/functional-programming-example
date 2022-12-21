/**
 * run "npx tsc -w" so the compiler watches and builds the file
 * run "node out/index.js" to run the app (or use the debugger)
 */
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

type Message1 = { kind: Kind.KIND1; request: string; data: number[] };

const getPositiveValues = (data: number[]) => data.filter((d) => d > 0);

/**
 * Different message type
 */
type Message2 = { kind: Kind.KIND2; author: string; data: number[] };
type Message3 = { kind: Kind.KIND3; username: string; email: string };

/**
 * UNION
 * We can create a UNION of types so we can be more abstract and handle them as the same thing (for the parts that overlap (common between union types))
 */
type Message1And2 = Message1 | Message2;

const processMessageData = (messages: Message1And2[]) => messages.map((m) => console.log(getPositiveValues(m.data)));

type MessagesAll = Message1 | Message2 | Message3;

// eslint-disable-next-line valid-jsdoc
/**
 * We can logically group types that are similar to us with a Union
 * Then let the compiler narrow-down the actual sub-type through code
 * No casting is needed
 * VALUE of "KIND" is used to define the type.
 */
const handleMessage = (msg: MessagesAll) => {
  // so far we can only access msg.king here since it's the only common field
  console.log(msg.kind);
  //however we can do a lot more than that (types are types, not classes)
  switch (msg.kind) {
    case Kind.KIND1:
      // know we know this is a Message1
      console.log(msg.request);
      console.log(msg.data);
      break;
    case Kind.KIND2:
      // know we know this is a Message2
      console.log(msg.author);
      console.log(msg.data);
      break;
    case Kind.KIND3:
      // know we know this is a Message3
      console.log(msg.email);
      console.log(msg.username);
      break;
    default:
      break;
  }
};

/**
 * INTERSECTION
 * Pull all the properties together to create a new type
 */

type Type1 = { something: string; somethingElse: string };
type Type2 = { evenMore: string; someOtherThings: string };
type MessageIntersection = Type1 & Type2;

const messageIntersectionObject: MessageIntersection = {
  something: '',
  somethingElse: '',
  evenMore: '',
  someOtherThings: '',
};

/**
 * PICK
 * You can pick properties from different types and build a new one
 */

type Message4 = User & Pick<Message1, 'data' | 'kind'>;

const message4Object: Message4 = {
  name: 'name',
  surname: 'surname',
  data: [],
  kind: Kind.KIND1,
};

console.log('\n', '\n', '\n');

// const a = (): void => b();

// const b = (): void => c();

// const c = (): void => a();

// a();
