# buffalo-client

[![npm version](https://img.shields.io/npm/v/buffalo-client.svg)](https://www.npmjs.com/package/buffalo-client)
[![TypeScript types](https://img.shields.io/npm/types/buffalo-client.svg)](https://www.npmjs.com/package/buffalo-client)

A Node.js / TypeScript client for the [buffalo.sh](https://buffalo.sh) API.

[npm](https://www.npmjs.com/package/buffalo-client) · [GitHub](https://github.com/Antidino72/Buffalo-client)

## Overview

`buffalo-client` is a small ESM library, written in TypeScript and published with type declarations, that wraps the HTTP API of [buffalo.sh](https://buffalo.sh). It exposes a single class, `BuffaloClient`, which keeps the session token in memory and sends it as a `Bearer` token on authenticated requests.

Available features (version 1.0.3):

- Sign up and log in
- List posts
- Create a post
- Like and unlike a post

> [!NOTE]
> This package is not presented as an official or affiliated Buffalo.sh product.

## Installation

```bash
npm install buffalo-client
```

## Requirements

- **ESM only.** The package declares `"type": "module"` and its `exports` map only defines an `import` condition, so `require("buffalo-client")` is not supported. From CommonJS, use a dynamic `import()`.
- **A runtime with a global `fetch`.** The library calls `fetch` directly and has no HTTP dependency. In practice this means a recent Node.js release (18 or later).
- **TypeScript (optional).** Type declarations are bundled; no `@types` package is needed.

> [!NOTE]
> No `engines` field is declared in `package.json`, so the minimum supported Node.js version is **to be confirmed**.

The only runtime dependency is [`dotenv`](https://www.npmjs.com/package/dotenv), which is loaded when the package is imported (see [Known limitations](#known-limitations)).

## Quick start

```ts
import { BuffaloClient } from "buffalo-client";

const client = new BuffaloClient();

// Log in. The returned token is stored in the client for later calls.
const { username } = await client.login("alice", "s3cret", "alice@example.com");
console.log(`Logged in as ${username}`);

// Fetch posts.
const posts = await client.getPosts();
for (const post of posts) {
  console.log(`${post.user.username}: ${post.content} (${post.likes} likes)`);
}
```

## API reference

All requests are sent to `https://buffalo.sh`. The base URL is hard-coded and cannot be changed. Request and response bodies are JSON.

| Method | HTTP request | Auth required |
| --- | --- | --- |
| `login(username, password, email)` | `POST /users/login` | No |
| `signup(username, password, email)` | `POST /users/signup` | No |
| `getPosts()` | `GET /posts/get` | Yes |
| `addPost(post)` | `POST /posts/add` | Yes |
| `likePost(postId)` | `PATCH /posts/like?postid=<postId>` | Yes |
| `unLikePost(postId)` | `PATCH /posts/unlike?postid=<postId>` | Yes |

**Authentication.** `login()` and `signup()` store the `token` field of the server response on the client instance. Methods marked "Auth required" send it as `Authorization: Bearer <token>`. If no token is stored, they throw before any request is made (see [Error handling](#error-handling)). The token is kept in memory only.

The snippets below assume `client` is a `BuffaloClient` that is already logged in.

### `new BuffaloClient()`

Creates an unauthenticated client. The constructor takes no arguments.

### `login(username, password, email)`

| Parameter | Type | Description |
| --- | --- | --- |
| `username` | `string` | Account username |
| `password` | `string` | Account password |
| `email` | `string` | Account email |

All three arguments are required. Note the argument order: `username`, `password`, `email`.

**Returns** `Promise<LoginResult>`: the parsed JSON response of `POST /users/login`. The `token` it contains is stored on the client.

```ts
const result = await client.login("alice", "s3cret", "alice@example.com");
// result: { username: string; token: string }
```

### `signup(username, password, email)`

Same parameters as `login()`.

**Returns** `Promise<void>`. The client stores the `token` field of the `POST /users/signup` response, but does not return the response.

```ts
await client.signup("alice", "s3cret", "alice@example.com");
```

> [!NOTE]
> Whether the server returns a token on sign-up, and therefore whether the client is authenticated right after `signup()`, is **to be confirmed** against the API.

### `getPosts()`

**Auth required.** Takes no parameters.

**Returns** `Promise<Post[]>`: the parsed JSON response of `GET /posts/get`.

```ts
const posts = await client.getPosts();
```

### `addPost(post)`

**Auth required.**

| Parameter | Type | Description |
| --- | --- | --- |
| `post` | [`SendPost`](#types) | Post to create. `user` and `content` are required, `category` is optional. |

**Returns** `Promise<Post>`: the parsed JSON response of `POST /posts/add`.

```ts
const created = await client.addPost({
  user: { username: "alice", userid: "YOUR_USER_ID" },
  content: "Hello from buffalo-client!",
});
```

> [!NOTE]
> `LoginResult` only exposes `username` and `token`. How to obtain the `userid` required by `SendPost` is **to be confirmed**. Posts returned by `getPosts()` do carry a `user.userid` field.

### `likePost(postId)` and `unLikePost(postId)`

**Auth required.** Note the capital `L` in `unLikePost`.

| Parameter | Type | Description |
| --- | --- | --- |
| `postId` | `string` | The `postid` of the target post (see [`Post`](#types)) |

**Returns** `Promise<unknown>`: the parsed JSON response, whose shape is not typed by the library.

```ts
await client.likePost("POST_ID");
await client.unLikePost("POST_ID");
```

## Error handling

The library does not define its own error classes. The following behaviors come directly from the implementation:

- **Not logged in.** `getPosts()`, `addPost()`, `likePost()` and `unLikePost()` throw an `Error` with the message `Non connecté : appelle login() d'abord` when no token is stored. The error is thrown **synchronously**, before a promise is returned, so use `try`/`catch` around `await` rather than `.catch()` on the returned promise.
- **Network failure.** `fetch` rejects (typically with a `TypeError`) and the rejection propagates unchanged.
- **Non-JSON response.** The body is always parsed with `response.json()`, so a response that is not valid JSON rejects with the resulting `SyntaxError`.
- **HTTP error status.** The status code is **not** checked. A 4xx or 5xx response with a JSON body is returned like a successful one, and the return types of the methods are not validated at runtime.

```ts
import { BuffaloClient } from "buffalo-client";

const client = new BuffaloClient();

try {
  await client.getPosts(); // no login() yet
} catch (error) {
  console.error((error as Error).message); // "Non connecté : appelle login() d'abord"
}
```

## Examples

### Authentication

```ts
import { BuffaloClient } from "buffalo-client";

const client = new BuffaloClient();

// Existing account
const { username, token } = await client.login("alice", "s3cret", "alice@example.com");
console.log(username, token);

// New account (the client stores the token from the response)
const other = new BuffaloClient();
await other.signup("bob", "s3cret", "bob@example.com");
```

### Fetching posts

```ts
import { BuffaloClient, type Post } from "buffalo-client";

const client = new BuffaloClient();
await client.login("alice", "s3cret", "alice@example.com");

const posts: Post[] = await client.getPosts();
const liked = posts.filter((post) => post.likedByUser);
console.log(`${posts.length} posts, ${liked.length} liked by you`);
```

### Creating a post

```ts
import { BuffaloClient, type SendPost } from "buffalo-client";

const client = new BuffaloClient();
await client.login("alice", "s3cret", "alice@example.com");

const draft: SendPost = {
  user: { username: "alice", userid: "YOUR_USER_ID" },
  content: "Hello from buffalo-client!",
};

const post = await client.addPost(draft);
console.log(post.postid);
```

### Like and unlike

```ts
import { BuffaloClient } from "buffalo-client";

const client = new BuffaloClient();
await client.login("alice", "s3cret", "alice@example.com");

const [first] = await client.getPosts();
if (first) {
  await client.likePost(first.postid);
  await client.unLikePost(first.postid);
}
```

## Types

Three types are exported, as type-only exports:

```ts
import type { Post, SendPost, LoginResult } from "buffalo-client";
```

| Type | Role |
| --- | --- |
| `LoginResult` | Response of `login()`. |
| `Post` | A post as returned by `getPosts()` and `addPost()`. |
| `SendPost` | Payload accepted by `addPost()`. |

```ts
interface LoginResult {
  username: string;
  token: string;
}

interface Post {
  postid: string;
  category: string;
  user: {
    username: string;
    userid: string;
  };
  content: string;
  likes: number;
  likedByUser: boolean;
}

interface SendPost {
  category?: string;
  user: {
    username: string;
    userid: string;
  };
  content: string;
}
```

## Known limitations


- **Fixed base URL.** `https://buffalo.sh` is hard-coded; there is no option to target another host.
- **No error mapping.** HTTP status codes are ignored and no custom errors are thrown (see [Error handling](#error-handling)).
- **Loosely typed results.** `likePost()` and `unLikePost()` return `Promise<unknown>`, and `signup()` returns `Promise<void>`.
- **Session handling.** The token is stored in memory only. There is no logout, refresh or persistence.
- **`userid` requirement.** `SendPost` requires a `userid`, which `login()` does not return (see [`addPost`](#addpostpost)).
- **ESM only.** See [Requirements](#requirements).

## Contributing

There is no formal contribution process documented yet. To work on the project locally:

```bash
git clone https://github.com/Antidino72/Buffalo-client.git
cd Buffalo-client
npm install
npm run build
```

`npm run build` runs `tsc` and writes the compiled output to `dist/`, which is the only folder published to npm.

## License

MIT