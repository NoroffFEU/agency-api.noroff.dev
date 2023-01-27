# agency.noroff.dev

## **Table of Contents**

1. [Installation](#install)
2. [Common Problems](#problems)
3. [Repository Etiquette](#Etiquette)
4. [QA Testing](#testing)
5. [Backend Board & Task Overview](#overview)
6. [Utility Functions](#utilities)
7. [Useful Links & Resources](#resources)

## Installation and setup guide <a id="install"></a>

Clone the repo in your desired manner.

Install dependencies

```
npm i
```

You will need a PostgresSQL database setup and running. Can be downloaded from here, https://www.postgresql.org/.

Make note of the port number and password you use, you will need them.

- Guide to getting started with your database. (In guide when creating a server it says use create/server, where as for me it was under register/server)
  https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/

- Prisma doc on PostgresSQL data base connection setup
  https://www.prisma.io/docs/concepts/database-connectors/postgresql

Create a .env file and fill in require details from your. Make sure when assigning your PORT number for Express it is different to your database port number to avoid connection errors. Usually the database URL locally will be `127.0.0.1`

```
DATABASE_URL="postgresql://username:password@databaseUrl:Port/databaseName?schema=schema"
PORT=NUMBER
SECRETSAUCE=RANDOMSTRING
```

When first connecting to your empty database generate the tables using

```
npx prisma migrate dev --name init
```

Then generate the prisma client using

```
npx prisma generate
```

Start server with nodemon, this will automatically restart the server as changes are made.

```
npm run watch
```

You can check your server is running using Postman or similar. To test your database you can `POST` on the `/users` endpoint, in Postman with a Body set to `raw`, `JSON`, and setting the request headers `Content-Type` to `application/json`.

```
http://localhost:PORT/users
```

```
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "something@something.com",
  "password": "password"
}
```

This should generate a response like so;

```json
{
  "id": "8ada9d4f-21eb-40c6-86d0-f9c10133305f",
  "email": "something@something.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": null,
  "role": "Applicant",
  "skills": [],
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YWRhOWQ0Zi0yMWViLTQwYzYtODZkMC1mOWMxMDEzMzMwNWYiLCJlbWFpbCI6InNvbWV0aGluZ0Bzb21ldGhpbmcuY29tIiwiaWF0IjoxNjc0NjcyMzUwLCJleHAiOjE2NzQ3NTg3NTB9.6X9m8NXJtDa45iQ76imrwLlgVLLoiTpJaBaxQ9ZirAM"
}
```

You can further test on the `GET` `/users` endpoint to get the user you just registered back.

## Common Problems <a id="problems"></a>

- Ensure Express is running and the database is running, in the pgAdmin 4 program if your database has a red x on it you should just need to click on it and enter a password to start it.
- The Prisma schema are not set in stone, and will likely be updated regularly, make sure when changing branches or updating the schema, to do the following;
  1. Terminate your express server, if its currently running.
  2. Re-generate your database tables and prisma client with `npx prisma migrate dev --name init` and `npx prisma generate`
  3. Some times migrations clear the whole database, so you will need to recreate your users/lists/applications/etc...
- When updating .env file variables you should terminate the express server and if you have updated the database URL, regenerate the prisma client using `npx prisma generate`

## Repository Etiquette <a id="Etiquette"></a>

- Name your branches in meaningful ways with the route at the start of the name. eg. `Users-POST-Login` or `Application-Swagger-Docs`.
- Delete branches once they have been merged into the routes main branch, there are currently 4 main branches for the existing routes `Users/Listings/Application/Offers`.

## QA Testing <a id="testing"></a>

Most endpoint should have a selection of basic tests made using Jest and Supertest. Useful link from the Jest docs.

- https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

QA aims for upcoming sprints

- Ensure all endpoints are using token verification where required.
- Ensure users is the creator of said resource when updating or deleting.
- Come to an agreement on error outputs to give a consistent feedback format to the frontend, /users currently all provide a message with additional error details as needed like so; `{message:"Bad request, invalid URL.", ...errors}`
- Create additional tests for a variety of invalid requests and unauthorized requests.
- Review all requests into your endpoint's branch and request review from other QA's/Scrum masters when merging into the main branch.

## Backend Board & Task Overview <a id="overview"></a>

Main discussion board for backend, additional boards linked under teams.

https://github.com/orgs/NoroffFEU/teams/backend

Project board, add your task, iteration, status and assign yourself to them here;

https://github.com/orgs/NoroffFEU/projects/12/views/1

Current sprint;

https://github.com/orgs/NoroffFEU/projects/12/views/2

### Overview of objectives for coming sprints

- Create a more detailed test suite for endpoints.
- Implement company model and routes.
- Validate tokens on authenticated endpoints.
- Add email verification and password reset by email.
- Implement a search strategy.
- Deal with issues raised by front end.

## Current Utility Functions <a id="utilities"></a>

In the `src/utilities` folder you will find a selection of reusable functions. Currently these include;

1. findUser.js - Find a user by `id` or `email`.
2. jsonWebToken.js - Sign and verify tokens.
3. mediaGuard.js - Verify a provided url is accessible.
4. password.js - Generate password hash, and compare plain text password to hash.

## Useful Links & Resources <a id="resources"></a>

PostgreSQL:

https://www.postgresql.org/

Prisma docs:

https://www.prisma.io/

Prisma JS setup examples:

https://github.com/prisma/prisma-examples/tree/latest/javascript

Prisma model guide:

https://www.youtube.com/watch?v=RebA5J-rlwg

Express docs:

https://expressjs.com/

Express LinkedIn Vids:

https://www.linkedin.com/learning/express-essential-training-14539342/

https://www.linkedin.com/learning/building-restful-apis-with-node-js-and-express-16069959/

How to create multiple routes in the same express.js server.

https://www.geeksforgeeks.org/how-to-create-multiple-routes-in-the-same-express-js-server/

Jest and Supertest:

https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

Swagger Documentation links;

https://swagger.io/docs/specification/basic-structure/

https://editor.swagger.io/

https://dev.to/kabartolo/how-to-document-an-express-api-with-swagger-ui-and-jsdoc-50do

Json Web Tokens

https://medium.com/@prashantramnyc/authenticate-rest-apis-in-node-js-using-jwt-json-web-tokens-f0e97669aad3

### Dependency links

Prettier:

https://www.npmjs.com/package/prettier

EsLint:

https://www.npmjs.com/package/eslint

Nodemon refreshes server as changes are made locally:

https://www.npmjs.com/package/nodemon

body parser weed out incorrect body requests before checking with server:

http://expressjs.com/en/resources/middleware/body-parser.html

bcrypt password hashing and salting:

https://www.npmjs.com/package/bcrypt

jsonwebtoken, token handling for logged in users:

https://www.npmjs.com/package/jsonwebtoken
