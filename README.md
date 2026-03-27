# NestJS + GraphQL + MongoDB — Complete Developer Guide
### Code-First vs Schema-First · REST to GraphQL Migration · Everything You Learned

---

## Table of Contents

1. [REST API vs GraphQL — The Fundamental Shift](#1-rest-api-vs-graphql--the-fundamental-shift)
2. [What is GraphQL](#2-what-is-graphql)
3. [Code-First Approach — Everything You Learned](#3-code-first-approach--everything-you-learned)
4. [Schema-First Approach — Everything You Learned](#4-schema-first-approach--everything-you-learned)
5. [Code-First vs Schema-First — Full Comparison](#5-code-first-vs-schema-first--full-comparison)
6. [Key Concepts Explained](#6-key-concepts-explained)
7. [MongoDB + Mongoose in GraphQL Context](#7-mongodb--mongoose-in-graphql-context)
8. [Architecture Layers Explained](#8-architecture-layers-explained)
9. [TypeScript Concepts You Encountered](#9-typescript-concepts-you-encountered)
10. [Errors You Faced and Why They Happened](#10-errors-you-faced-and-why-they-happened)
11. [Which Approach is Best for What Purpose](#11-which-approach-is-best-for-what-purpose)
12. [Quick Reference Cheat Sheet](#12-quick-reference-cheat-sheet)

---

## 1. REST API vs GraphQL — The Fundamental Shift

Coming from REST, GraphQL feels different at first. Here is exactly what changes and why.

### How REST works (what you already know)

In REST, the server decides what data each endpoint returns. You have fixed URLs and fixed response shapes.

```
GET    /authors          → returns ALL author fields always
GET    /authors/:id      → returns ONE author with ALL fields
GET    /authors/:id/books → separate request just for books
POST   /authors          → create author
PUT    /authors/:id      → update author
DELETE /authors/:id      → delete author
```

**Problems with REST you've probably experienced:**

- **Over-fetching** — you ask for an author but get 20 fields when you only needed `name` and `bio`
- **Under-fetching** — you need author + their books but have to make 2 separate requests
- **Multiple round trips** — to show a book page with author info you call `/book/:id` then `/author/:authorId`
- **Versioning headaches** — when shape changes you create `/api/v2/authors` and maintain both
- **No contract** — client and server agree informally on what fields exist

### How GraphQL fixes these problems

In GraphQL there is ONE endpoint: `POST /graphql`

The **client decides** exactly what fields it wants. The server only returns what was asked for.

```graphql
# Client asks for EXACTLY this — nothing more, nothing less
query {
  author(id: "123") {
    name          # only these 3 fields
    bio
    books {       # books fetched in the SAME request — no second call
      title
      genre
    }
  }
}
```

**The response shape exactly matches the query shape:**

```json
{
  "data": {
    "author": {
      "name": "George Orwell",
      "bio": "English novelist",
      "books": [
        { "title": "1984", "genre": "Dystopian" }
      ]
    }
  }
}
```

### REST vs GraphQL — Direct Comparison Table

| Concept | REST | GraphQL |
|---|---|---|
| Endpoints | Many (`/users`, `/posts`, `/books`) | One (`/graphql`) |
| Who decides response shape | Server | Client |
| Fetching related data | Multiple requests | One request with nested fields |
| Over-fetching | Common problem | Eliminated |
| Under-fetching | Common problem | Eliminated |
| API documentation | Swagger / Postman | Self-documenting via schema |
| Versioning | `/api/v1`, `/api/v2` | Evolve schema, deprecate fields |
| Data reading | `GET` | `query` |
| Data writing | `POST`, `PUT`, `DELETE` | `mutation` |
| Real-time | Requires WebSocket setup | Built-in `subscription` |
| Type safety | Optional (OpenAPI) | Built into the schema |
| Error format | HTTP status codes (404, 500) | Always 200, errors in `errors` array |

### The Mental Model Shift

```
REST thinking:
"I have an endpoint for each resource"
/books → books data
/authors → authors data
/books/1/author → relationship data

GraphQL thinking:
"I have a graph of connected data, client traverses it"
books { author { name } }  ← one query, traverses the graph
```

---

## 2. What is GraphQL

GraphQL is a **query language for your API** and a **runtime for executing those queries**. It was created by Facebook in 2012 and open-sourced in 2015.

### Core Building Blocks

#### Types
Everything in GraphQL is typed. The schema defines every piece of data.

```graphql
type Author {
  _id: ID!          # ID scalar, required (!)
  name: String!     # String scalar, required
  bio: String       # String scalar, optional (no !)
  books: [Book!]    # array of Books, optional array
}
```

#### Scalars — the primitive types

| Scalar | What it maps to |
|---|---|
| `String` | TypeScript `string` |
| `Int` | TypeScript `number` (integer) |
| `Float` | TypeScript `number` (decimal) |
| `Boolean` | TypeScript `boolean` |
| `ID` | TypeScript `string` (unique identifier) |

#### The `!` symbol means required (non-nullable)

```graphql
name: String!    # MUST have a value — never null
bio: String      # CAN be null — optional field
books: [Book!]!  # array itself required, each item inside required
books: [Book!]   # array can be null, but if present items are required
books: [Book]!   # array required, but items inside can be null
```

#### Queries — reading data

```graphql
type Query {
  authors: [Author!]!        # returns list of authors
  author(id: ID!): Author    # returns single author by id, can be null
}
```

#### Mutations — writing data

```graphql
type Mutation {
  createAuthor(createAuthorInput: CreateAuthorInput!): Author!
  updateBook(updateBookInput: UpdateBookInput!): Book!
  deleteBook(id: ID!): Boolean!
}
```

#### Input Types — for mutation arguments

```graphql
input CreateAuthorInput {
  name: String!
  bio: String
}
```

The difference between `type` and `input` — `type` is for output (what server sends), `input` is for input (what client sends).

---

## 3. Code-First Approach — Everything You Learned

### What Code-First means

You write **TypeScript classes with decorators**. NestJS reads those decorators and **automatically generates** the GraphQL schema file for you. You never write `.graphql` files.

```
You write TypeScript → NestJS generates → schema.gql (auto, never edit)
```

### The key decorators you used

#### `@ObjectType()` — defines a GraphQL type

```typescript
@ObjectType()           // ← tells NestJS: "make a GraphQL type from this class"
export class Author {
  @Field(() => ID)      // ← expose this property in GraphQL
  _id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })  // nullable: true → no ! in schema
  bio?: string;
}
```

What NestJS generates from this automatically:
```graphql
type Author {
  _id: ID!
  name: String!
  bio: String
}
```

#### `@InputType()` — defines a GraphQL input

```typescript
@InputType()
export class CreateAuthorInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  bio?: string;
}
```

Generates:
```graphql
input CreateAuthorInput {
  name: String!
  bio: String
}
```

#### `@Resolver(() => Author)` — links resolver class to a GraphQL type

```typescript
@Resolver(() => Author)   // ← pass the CLASS directly
export class AuthorResolver { }
```

#### `@Query(() => [Author])` — defines a query operation

```typescript
@Query(() => [Author], { name: 'authors' })
// return type ↑           query name ↑
findAll(): Promise<Author[]> { }
```

#### `@Mutation(() => Author)` — defines a mutation operation

```typescript
@Mutation(() => Author)
createAuthor(@Args('createAuthorInput') input: CreateAuthorInput) { }
```

#### `@Args()` — extracts arguments from GraphQL operation

```typescript
// Simple arg
@Args('id', { type: () => ID }) id: string

// Input object arg
@Args('createAuthorInput') input: CreateAuthorInput
```

#### `@ResolveField()` — resolves a virtual/relational field

```typescript
@ResolveField(() => [Book], { name: 'books' })
async resolveBooks(@Parent() author: AuthorDocument): Promise<Book[]> {
  // @Parent() gives you the already-resolved Author document
  return this.bookService.findByAuthorId(author._id.toString());
}
```

This fires ONLY when the client requests the `books` field. If they don't ask for `books`, this method never runs.

### The `autoSchemaFile` config

```typescript
// app.module.ts
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),  // ← generated file path
  sortSchema: true,
})
```

Every time the app starts, NestJS scans all your decorated classes and writes `schema.gql`. You never edit that file — it is always overwritten.

### Dual-purpose entities — the key Code-First pattern

In code-first your entity class does TWO jobs at once:

```typescript
@Schema({ timestamps: true })   // ← Job 1: Mongoose schema (MongoDB)
@ObjectType()                   // ← Job 2: GraphQL type (API)
export class Author {

  @Field(() => ID)              // ← GraphQL field
  _id: string;

  @Prop({ required: true })     // ← MongoDB column
  @Field(() => String)          // ← GraphQL field (both decorators on same property)
  name: string;
}
```

**This is both the power and the limitation of code-first.** One file, one class, two frameworks sharing it.

### What you learned about circular dependencies in Code-First

When `Author` has `books: Book[]` and `Book` has `author: Author`, each class references the other. NestJS modules solve this with `forwardRef()`:

```typescript
// author.module.ts
imports: [forwardRef(() => BookModule)]   // ← breaks the circular reference

// book.module.ts
imports: [forwardRef(() => AuthorModule)] // ← same on the other side
```

Without `forwardRef()`, the app crashes at startup because both modules try to load each other first.

---

## 4. Schema-First Approach — Everything You Learned

### What Schema-First means

You write **plain `.graphql` SDL files** by hand. NestJS reads those files and maps operations to your resolver methods using string-based decorators. TypeScript classes have no GraphQL decorators at all.

```
You write .graphql SDL files → NestJS reads them → resolvers map via string names
```

### The SDL files — the heart of schema-first

You created one `.graphql` file per module:

```graphql
# modules/author/schemas/author.graphql

type Author {
  _id: ID!
  name: String!
  bio: String
  books: [Book!]
}

input CreateAuthorInput {
  name: String!
  bio: String
}

extend type Query {
  authors: [Author!]!
  author(id: ID!): Author
}

extend type Mutation {
  createAuthor(createAuthorInput: CreateAuthorInput!): Author!
}
```

The word **`extend`** is important. Because you have a root `schema.graphql` that defines the base `Query` and `Mutation` types, every module uses `extend` to add its operations on top.

### The root schema file — why it exists

```graphql
# src/graphql/schema.graphql
type Query {
  _root: String    # placeholder — required so modules can 'extend' it
}
type Mutation {
  _root: String
}
```

Without this, `extend type Query` in your module SDL files would throw: `Cannot extend type "Query" because it is not defined.`

### The `typePaths` config — the schema-first switch

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  typePaths: ['./src/**/*.graphql'],   // ← reads ALL .graphql files, merges them
  playground: true,
  // NO autoSchemaFile here — that is code-first only
})
```

The glob `./src/**/*.graphql` finds every `.graphql` file anywhere under `src/` and merges them into one unified schema.

### String-based decorators — the schema-first resolver style

```typescript
@Resolver('Author')        // ← string name matching SDL type name
export class AuthorResolver {

  @Query('authors')        // ← string matching SDL query name exactly
  async findAll() { }

  @Query('author')         // ← string matching SDL query name exactly
  async findOne(@Args('id') id: string) { }   // just arg name — no type declaration

  @Mutation('createAuthor')  // ← string matching SDL mutation name exactly
  async createAuthor(@Args('createAuthorInput') input: CreateAuthorInput) { }

  @ResolveField('books')   // ← string matching SDL field name
  async resolveBooks(@Parent() author: AuthorDocument) { }
}
```

**The rule:** every string you pass to these decorators must **exactly match** a name in your SDL files. One typo and GraphQL can't find the resolver.

### Clean entities — no GraphQL decorators

```typescript
// schema-first entity — pure Mongoose, zero GraphQL
@Schema({ timestamps: true })
export class Author {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: null })
  bio?: string;
  // no @ObjectType, no @Field — GraphQL shape is in the SDL file
}
```

### Clean DTOs — only class-validator

```typescript
// schema-first DTO — only validation, no GraphQL decorators
export class CreateAuthorInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  bio?: string;
  // no @InputType, no @Field
}
```

### Type generation — `GraphQLDefinitionsFactory` vs codegen

You used **codegen** (`codegen.yml`) which is the more powerful option. It reads your SDL files and generates TypeScript types into `src/graphql/generated.ts`.

The `GQL_` prefix in your generated types came from `typesPrefix: GQL_` in your `codegen.yml`:

```yaml
config:
  typesPrefix: GQL_    # all types become GQL_Author, GQL_Book, etc.
```

This prefix is a convention to distinguish GraphQL types from your Mongoose entity classes. Without it, you'd have two classes both named `Author` — one Mongoose, one GraphQL — and TypeScript would get confused.

---

## 5. Code-First vs Schema-First — Full Comparison

### File-by-file comparison

| File | Code-First | Schema-First |
|---|---|---|
| Entity | `@Schema()` + `@ObjectType()` + `@Field()` | `@Schema()` only — pure Mongoose |
| DTO | `@InputType()` + `@Field()` + validators | validators only — no GraphQL |
| Resolver | `@Resolver(() => Class)`, `@Query(() => Type)` | `@Resolver('Name')`, `@Query('name')` |
| SDL files | None — auto-generated | Hand-written per module |
| Generated schema | `schema.gql` (auto, never edit) | None |
| Generated types | None needed | `generated.ts` from codegen |
| `app.module.ts` | `autoSchemaFile: '...'` | `typePaths: ['.../**/*.graphql']` |
| Args typing | `@Args('id', { type: () => ID })` | `@Args('id')` — type in SDL |

### Decorator comparison

```typescript
// ─── CODE-FIRST ───────────────────────────────────────────────────────────────

@Resolver(() => Author)                          // class reference
@Query(() => [Author], { name: 'authors' })      // return type declared here
@Query(() => Author, { name: 'author' })
@Mutation(() => Author)                          // return type declared here
@ResolveField(() => [Book], { name: 'books' })   // return type declared here
@Args('id', { type: () => ID }) id: string       // type declared in args


// ─── SCHEMA-FIRST ─────────────────────────────────────────────────────────────

@Resolver('Author')                              // string name
@Query('authors')                                // no return type — in SDL
@Query('author')
@Mutation('createAuthor')                        // no return type — in SDL
@ResolveField('books')                           // no return type — in SDL
@Args('id') id: string                           // no type — in SDL
```

### What changes vs what stays the same

**What changes completely:**
- Entity classes (remove `@ObjectType`, `@Field`)
- DTO classes (remove `@InputType`, `@Field`)
- Resolver decorators (string-based instead of class-based)
- `app.module.ts` config (`typePaths` not `autoSchemaFile`)

**What stays 100% identical:**
- Services — zero changes
- Repositories — zero changes
- Modules — zero changes
- MongoDB connection — zero changes
- `class-validator` decorators on DTOs — stay exactly the same
- `forwardRef()` circular dependency handling — stays exactly the same
- Business logic — zero changes

This is why the migration was mostly straightforward. Only the GraphQL communication layer changed.

---

## 6. Key Concepts Explained

### `@ResolveField()` — why it exists and how it works

In your database, `Author` and `Book` are stored in separate MongoDB collections. A `Book` document stores the `authorId` but not the full author object. A query like this:

```graphql
query {
  book(id: "123") {
    title
    author {      ← this is NOT stored in the books collection
      name
    }
  }
}
```

When GraphQL sees `author` is requested, it automatically calls your `@ResolveField('author')` method, passing the already-fetched `Book` document as `@Parent()`. Your method then fetches the author using `book.authorId`.

```typescript
@ResolveField('author')
async resolveAuthor(@Parent() book: BookDocument): Promise<any> {
  // book is the already-resolved Book from the books collection
  // now fetch its author from the authors collection
  return this.authorService.findOne(book.authorId.toString());
}
```

**Performance note:** If the client does NOT ask for `author { ... }` in their query, this method NEVER runs. GraphQL only resolves fields that are actually requested. This is called **lazy resolution** and it is one of GraphQL's core efficiency advantages over REST.

### `@ObjectType()` — what it does internally

When NestJS starts up in code-first mode, it scans every class decorated with `@ObjectType()`. For each one it reads all `@Field()` decorators and builds a GraphQL type definition. It then writes all these types into the `schema.gql` file.

Think of it as:
```
@ObjectType() + @Field() decorators = the instructions NestJS uses to write your schema
```

### `BookDocument` and `AuthorDocument` — why they exist

Mongoose returns documents that are more than just your plain class. They include MongoDB internals like `_id`, `.save()`, `.toObject()`, `.__v`, etc.

```typescript
export type BookDocument = Book & Document;
//                         ^^^^   ^^^^^^^^
//                your fields   + Mongoose Document interface
```

When you type a parameter as `BookDocument`, TypeScript knows the object has both your custom fields (`title`, `genre`) AND Mongoose methods (`_id`, `save()`, etc.).

### `exec()` — why it's on every Mongoose query

```typescript
return this.bookModel.find().exec();
```

`this.bookModel.find()` returns a **Mongoose Query object** — a lazy builder that hasn't run yet. You can chain more operations onto it:

```typescript
this.bookModel
  .find({ genre: 'Fiction' })
  .sort({ title: 1 })
  .limit(10)
  .select('title genre')
  // still hasn't run — still building
  .exec()  // ← NOW it runs and returns a real Promise
```

Without `.exec()`, you get a thenable Mongoose Query, not a true Promise. Using `.exec()` is best practice because it gives you proper Promise semantics and better error stack traces.

### `forwardRef()` — solving circular dependencies

Your `Author` module imports `Book` module (to resolve the `books` field). Your `Book` module imports `Author` module (to resolve the `author` field). Each module depends on the other — a circular dependency.

Without `forwardRef()`:
- NestJS tries to load `AuthorModule` → needs `BookModule` → needs `AuthorModule` → crash

With `forwardRef()`:
```typescript
// author.module.ts
imports: [forwardRef(() => BookModule)]

// book.module.ts
imports: [forwardRef(() => AuthorModule)]
```

The `() =>` lambda delays evaluation. NestJS loads both modules first, then wires the circular reference after both exist in memory.

### Output DTOs — when to use them

In your project, output DTOs were not needed because your entity and GraphQL response shape were identical. But they become essential when:

```typescript
// Your Mongoose entity stores this:
class User {
  name: string;
  email: string;
  password: string;     // SENSITIVE — never send to client
  resetToken: string;   // INTERNAL — never send to client
}

// Your GraphQL output should only have this:
@ObjectType()
class UserOutput {
  @Field() name: string;
  @Field() email: string;
  // password and resetToken intentionally absent
}
```

Use output DTOs when your stored data shape differs from your API response shape.

---

## 7. MongoDB + Mongoose in GraphQL Context

### Why the same database works for both approaches

MongoDB doesn't know or care about GraphQL. It stores documents in collections. GraphQL is purely an API layer on top. The migration from code-first to schema-first only changed how the API communicates — MongoDB kept the same connection string, same collections, same documents.

```
GraphQL Layer      →    Service Layer    →    Repository Layer    →    MongoDB
(changed approach)      (unchanged)           (unchanged)              (unchanged)
```

### Schema decorators in schema-first

Even in schema-first, your Mongoose schemas use decorators:

```typescript
@Schema({ timestamps: true })    // ← enables createdAt/updatedAt automatically
export class Book {
  @Prop({ required: true })      // ← MongoDB validation
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Author' })
  authorId: string;              // ← stores reference to Author document
}
```

`timestamps: true` tells Mongoose to automatically add and manage `createdAt` and `updatedAt` fields on every document. You never set them manually.

### `_id` in GraphQL vs MongoDB

MongoDB generates `_id` as an `ObjectId` — a 24-character hex string like `507f1f77bcf86cd799439011`. In GraphQL you expose it as the `ID` scalar type.

The `.toString()` call in your resolvers converts MongoDB's `ObjectId` object to a plain string:

```typescript
// In @ResolveField
const authorId = book.authorId.toString();   // ObjectId → "507f1f77bcf86cd799439011"
return this.authorService.findOne(authorId);
```

Without `.toString()`, you'd be comparing an `ObjectId` object with a string, and Mongoose's `findById` would fail silently.

---

## 8. Architecture Layers Explained

Your project followed clean architecture with 4 distinct layers. Each layer has one responsibility.

```
GraphQL Client
      ↓ query/mutation
  Resolver Layer        ← thin, only receives and returns data
      ↓
  Service Layer         ← all business logic, error handling
      ↓
  Repository Layer      ← all database calls, Mongoose operations
      ↓
  MongoDB
```

### Why this separation matters

| Layer | Responsibility | What it NEVER does |
|---|---|---|
| Resolver | Receive GraphQL args, call service, return result | No DB calls, no business logic |
| Service | Validate, transform, orchestrate, handle errors | No direct DB calls, no GraphQL concerns |
| Repository | All Mongoose operations | No business logic, no error handling |
| Entity | Define DB schema shape | No business logic |

**If you need to add REST endpoints later**, you only add controllers. Services and repositories stay exactly the same. Your business logic is never trapped in the GraphQL layer.

**If you switch databases** from MongoDB to PostgreSQL, you only rewrite repositories. Services stay the same.

### Thin resolvers — the golden rule

```typescript
// ✅ CORRECT — thin resolver, delegates everything
@Query('authors')
async findAll(): Promise<any[]> {
  return this.authorService.findAll();  // one line, done
}

// ❌ WRONG — fat resolver, logic leaking in
@Query('authors')
async findAll(): Promise<any[]> {
  const authors = await this.authorModel.find().exec();  // DB call in resolver!
  if (!authors.length) throw new Error('No authors');    // logic in resolver!
  return authors.map(a => ({ ...a, displayName: a.name.toUpperCase() }));  // transform in resolver!
}
```

---

## 9. TypeScript Concepts You Encountered

### `import type` vs `import`

When your `tsconfig.json` has `isolatedModules: true` and `emitDecoratorMetadata: true`, TypeScript needs to emit runtime type information for decorator parameters. But if you import a type-only symbol (like `AuthorDocument` which is a type alias, not a class), TypeScript can't emit runtime info for it.

```typescript
// ❌ CAUSES ERROR with isolatedModules + emitDecoratorMetadata
import { AuthorDocument } from './entities/author.entity';
async resolveBooks(@Parent() author: AuthorDocument) { }

// ✅ CORRECT — tells TypeScript "this is only used as a type, not a value"
import type { AuthorDocument } from './entities/author.entity';
async resolveBooks(@Parent() author: AuthorDocument) { }
```

`import type` is a TypeScript 3.8+ feature that tells the compiler the import is purely for type-checking and should be erased at runtime. It fixes the `isolatedModules` error.

### `Promise<any>` in resolvers — why it's correct

Your Mongoose service returns `AuthorDocument` (Mongoose document). Your GraphQL schema expects `GQL_Author` (generated type). These don't match exactly because `GQL_Author` has `books` and virtual fields that don't exist on the Mongoose document — they get resolved later by `@ResolveField`.

```typescript
// GQL_Author requires: _id, name, bio, books, createdAt, updatedAt
// AuthorDocument has:  _id, name, bio, createdAt, updatedAt
//                      (books is missing — it's a virtual resolved separately)

// TypeScript complains if you type it as GQL_Author
async findAll(): Promise<GQL_Author[]>  // ← error: books is missing

// Promise<any> is correct here — GraphQL handles the shape enforcement
async findAll(): Promise<any[]>         // ← correct approach
```

The SDL file is your type contract with GraphQL clients. TypeScript doesn't need to re-enforce it at the resolver method level.

### `as any` casting

When you access MongoDB's `_id` field in certain contexts:

```typescript
const authorId = ((author as any)._id ?? (author as any).id).toString();
```

`as any` tells TypeScript to skip type checking for that expression. It's used here because Mongoose documents sometimes expose the ObjectId on `_id` and sometimes on `id` (a virtual getter), and the TypeScript types don't always agree with runtime behavior.

---

## 10. Errors You Faced and Why They Happened

### Error 1 — `Module has no exported member 'Author'`

```
Module '"../../graphql/generated"' has no exported member 'Author'
```

**Why:** Your codegen used `typesPrefix: GQL_` in `codegen.yml`, so all types were generated as `GQL_Author`, `GQL_Book`, not `Author`, `Book`.

**Fix:** Import using the prefix: `import { GQL_Author, GQL_Book } from '../../graphql/generated'`

**Lesson:** The `typesPrefix` config in codegen renames all generated types. Always check the generated file first to see what names were actually produced before writing imports.

### Error 2 — `AuthorDocument is missing books, createdAt, updatedAt from GQL_Author`

```
Type 'Author & Document' is missing the following properties from type 'GQL_Author': books, createdAt, updatedAt
```

**Why:** `GQL_Author` is the complete GraphQL shape including virtual fields. `AuthorDocument` is the Mongoose document which doesn't have `books` (it's resolved by `@ResolveField` later) and doesn't declare `createdAt`/`updatedAt` even though they exist in the DB (because you didn't add them to the entity class).

**Fix:** Use `Promise<any>` return types on resolver methods. The SDL enforces the shape at the GraphQL layer.

**Lesson:** Mongoose documents and GraphQL types serve different purposes and don't need to match exactly at the TypeScript level. GraphQL resolves the final shape; TypeScript doesn't need to re-enforce it.

### Error 3 — `isolatedModules` + `emitDecoratorMetadata` conflict

```
A type referenced in a decorated signature must be imported with 'import type'
```

**Why:** `isolatedModules: true` processes each file in isolation. `emitDecoratorMetadata: true` tries to emit runtime type metadata for decorator parameters. When a parameter type is a type alias (not a real class), TypeScript can't emit runtime metadata for it in isolated mode.

**Fix:** `import type { AuthorDocument }` instead of `import { AuthorDocument }`

**Lesson:** Type aliases (created with `export type X = ...`) are erased at runtime. They cannot be used as runtime values. `import type` explicitly signals this to TypeScript.

### Error 4 — `extend type Query` failing at startup

**Why:** You used `extend type Query` in module SDL files but didn't have a root `schema.graphql` defining the base `Query` type first.

**Fix:** Create `src/graphql/schema.graphql` with base `type Query { _root: String }` and `type Mutation { _root: String }`.

**Lesson:** In schema-first NestJS with multiple SDL files, one file must define the root types and all others extend them.

---

## 11. Which Approach is Best for What Purpose

### Use Code-First when...

**You are a TypeScript-first developer**

If your team thinks in TypeScript and wants everything in one place, code-first lets you define your data shape once and have both the database schema and GraphQL schema derived from it automatically.

**Your project is small to medium**

For projects with 5–15 entities, code-first is faster to build. You write one class and get both Mongoose schema and GraphQL type for free.

**You want rapid prototyping**

No SDL files to maintain, no codegen to run. Add a `@Field()` and the schema updates on the next app start. Very fast iteration.

**Your team is new to GraphQL**

Code-first is easier to learn coming from REST because you stay in TypeScript the whole time. You don't need to learn SDL syntax immediately.

**Your entity shape and API shape are identical**

When what you store in MongoDB is exactly what you expose in GraphQL, code-first dual-purpose entities shine.

```
Best for: Startups, internal tools, TypeScript-heavy teams, rapid prototyping,
          small-medium APIs, solo developers, GraphQL beginners
```

### Use Schema-First when...

**You work in a team with frontend developers**

SDL files are pure GraphQL — frontend developers, mobile developers, and backend developers can all read and discuss them without knowing TypeScript. The schema becomes a shared language.

**Your API is a public or partner-facing contract**

SDL files are clean, readable, and version-controllable. Non-engineers can review them. They are the formal contract of your API.

**Your stored data shape differs from your API shape**

When you store raw data in MongoDB but transform, hide, or augment it before sending to clients, having explicit SDL files makes the API shape obvious and deliberate.

**You use GraphQL Federation or a Gateway**

Large microservice architectures using Apollo Federation require explicit SDL files. Schema-first is the natural fit.

**Your team already has GraphQL expertise**

Experienced GraphQL teams often prefer writing SDL because they think directly in GraphQL types, not TypeScript mappings.

**You want codegen-powered full-stack type safety**

With codegen, your generated types flow from SDL → backend types → frontend types. Your React app can import the same generated types as your NestJS backend. This end-to-end type safety is only possible with schema-first.

```
Best for: Large teams, public APIs, microservices, frontend-backend collaboration,
          enterprise applications, teams with GraphQL expertise
```

### Decision Framework

```
Is your team TypeScript-only and small?
  └─ YES → Code-First

Do non-TypeScript developers need to read your schema?
  └─ YES → Schema-First

Is this a public API or a contract with other teams?
  └─ YES → Schema-First

Are you building a prototype or internal tool quickly?
  └─ YES → Code-First

Do you use GraphQL Federation / microservices?
  └─ YES → Schema-First

Is your entity shape identical to your API shape?
  └─ YES → Code-First (dual-purpose entities work well)
  └─ NO  → Schema-First (separate SDL from entity)

Are you learning GraphQL for the first time?
  └─ YES → Code-First (stay in TypeScript, learn concepts first)
```

### The honest answer

For most **NestJS + MongoDB** projects built by a small TypeScript team: **Code-First is more productive**. You write less code, maintain fewer files, and everything stays in TypeScript.

For **team projects, public APIs, and anything that needs frontend code generation**: **Schema-First is more scalable**. The SDL file becomes the shared truth everyone works from.

**Both are valid. Neither is universally better.**

---

## 12. Quick Reference Cheat Sheet

### Code-First decorators

```typescript
@ObjectType()                          // class is a GraphQL type
@InputType()                           // class is a GraphQL input
@Field(() => String)                   // expose property in schema
@Field(() => String, { nullable: true }) // optional field (no ! in schema)
@Field(() => [Book])                   // array field
@Resolver(() => Author)                // resolver for Author type
@Query(() => [Author], { name: 'authors' }) // query returning Author list
@Query(() => Author, { name: 'author' })    // query returning single Author
@Mutation(() => Author)                // mutation returning Author
@ResolveField(() => [Book], { name: 'books' }) // virtual field resolver
@Args('id', { type: () => ID })        // extract arg with type
@Args('input')                         // extract input object
@Parent()                              // get parent document in ResolveField
```

### Schema-First decorators

```typescript
@Resolver('Author')         // resolver for 'Author' SDL type
@Query('authors')           // maps to query named 'authors' in SDL
@Query('author')            // maps to query named 'author' in SDL
@Mutation('createAuthor')   // maps to mutation in SDL
@ResolveField('books')      // maps to field 'books' in SDL type
@Args('id')                 // extract arg (type comes from SDL)
@Parent()                   // same as code-first
```

### SDL syntax quick reference

```graphql
# Required field
name: String!

# Optional field
bio: String

# Required array of required items
books: [Book!]!

# Optional array
books: [Book!]

# Type definition
type Author {
  _id: ID!
  name: String!
}

# Input definition (for mutations)
input CreateAuthorInput {
  name: String!
  bio: String
}

# Extend root types (in module SDL files)
extend type Query {
  authors: [Author!]!
  author(id: ID!): Author
}

extend type Mutation {
  createAuthor(input: CreateAuthorInput!): Author!
  deleteBook(id: ID!): Boolean!
}
```

### Mongoose essentials

```typescript
@Schema({ timestamps: true })           // enable createdAt / updatedAt
@Prop({ required: true })               // required field
@Prop({ default: null })                // optional with default
@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Author' })  // reference

// Document type for TypeScript safety
export type AuthorDocument = Author & Document;

// Schema factory
export const AuthorSchema = SchemaFactory.createForClass(Author);

// Repository patterns
this.model.find().exec()                        // find all
this.model.findById(id).exec()                  // find by id
this.model.find({ authorId }).exec()            // find by field
this.model.findByIdAndUpdate(id, { $set: data }, { new: true }).exec()  // update
this.model.findByIdAndDelete(id).exec()         // delete
```

### Common GraphQL operations to test

```graphql
# Create author
mutation {
  createAuthor(createAuthorInput: { name: "George Orwell", bio: "English novelist" }) {
    _id name bio
  }
}

# Get all authors
query {
  authors { _id name bio }
}

# Get author WITH their books (ResolveField fires)
query {
  author(id: "ID_HERE") {
    _id name bio
    books { _id title genre publishedYear }
  }
}

# Create book
mutation {
  createBook(createBookInput: {
    title: "1984"
    genre: "Dystopian Fiction"
    publishedYear: 1949
    authorId: "AUTHOR_ID_HERE"
  }) {
    _id title genre publishedYear
  }
}

# Get book WITH author (ResolveField fires)
query {
  book(id: "ID_HERE") {
    _id title genre
    author { _id name bio }
  }
}

# Update book (partial — only send fields to change)
mutation {
  updateBook(updateBookInput: { id: "ID_HERE", title: "Nineteen Eighty-Four" }) {
    _id title genre
  }
}

# Delete book
mutation {
  deleteBook(id: "ID_HERE")
}
```

### Error quick fixes

| Error | Cause | Fix |
|---|---|---|
| `has no exported member 'Author'` | codegen used `GQL_` prefix | import as `GQL_Author` |
| `missing properties: books, createdAt` | Mongoose doc ≠ GQL type | use `Promise<any>` return type |
| `isolatedModules` on `AuthorDocument` | type alias in decorator position | use `import type { AuthorDocument }` |
| `Cannot extend type Query` | no root schema.graphql | add base `type Query { _root: String }` |
| Circular dependency crash | modules importing each other | use `forwardRef(() => Module)` |
| `_id` comparison fails silently | ObjectId vs string | call `.toString()` on MongoDB ids |

---

*Built with NestJS 10 · GraphQL 16 · MongoDB 7 · Mongoose 7 · TypeScript 5*