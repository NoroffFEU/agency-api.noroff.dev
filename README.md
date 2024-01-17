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

We have a docker container for both the database and the server, so you will need to have docker, preferably docker desktop as well.
https://www.docker.com/products/docker-desktop/

Create a .env file copy over the .env.example file.

```
DATABASE_URL="postgresql://postgres:postgres@db:5432/postgres?schema=schema"
PORT=3000

SECRETSAUCE=SECRETKEY

#docker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
```

To start the database and server run the following command in the root of the project.

```bash
docker-compose up
```

For development you can run the following command to start the server in watch mode, (this will restart the server when changes are made to the code. #not working for me#)

```bash
docker-compose up -d
```

### First time setup for development

When doing this for the first time you will need open`noroff_agency_api` container terminal and run the following commands to create the database and tables. You will also need to run this command when doing any updates to the prisma schema. (This might be fixable, with alteration to the dev docker-compose file.)

```bash
npx prisma migrate dev --name init
```

![opening the container terminal](./readme-images/Screenshot%202024-01-17%20142118.jpg)
![running command](./readme-images/Screenshot%202024-01-17%20142213.jpg)

### Accessing the API

Your database will now be running and your server will be running at 127.0.0.1:3000.
You can check your server is running using Postman or similar. To test your database you can `POST` on the `/users` endpoint, in Postman with a Body set to `raw`, `JSON`, and setting the request headers `Content-Type` to `application/json`.

```
{
    "email": "example@example.com",
    "firstName": "John",
    "lastName": "Joe",
    "password": "password",
    "role": "Client"
}
```

This should generate a response like so;

```json
{
  "id": "c2ee3340-b4da-467f-8e65-43b9a9f74319",
  "email": "example@example.com",
  "firstName": "John",
  "lastName": "Joe",
  "profile": null,
  "avatar": null,
  "role": "Client",
  "skills": [],
  "companyId": null,
  "created": "2024-01-17T13:25:33.173Z",
  "updated": "2024-01-17T13:25:33.173Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMmVlMzM0MC1iNGRhLTQ2N2YtOGU2NS00M2I5YTlmNzQzMTkiLCJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDU0OTc5MzMsImV4cCI6MTcwNTU4NDMzM30.2nPRV_Xy-vaZR3MUbAKvjcY36otI9nDfuy4lXFpqMME"
}
```

You can further test on the `GET` `/users` endpoint to get the user you just registered back.

### Docker and Development Possible Issues

When running the dev version I find unless I restart the server container manually, it will not update the server with any changes made to the code. This is not ideal my work around is to modify the .env database url.

```
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres?schema=schema"
```

The in VSC terminal run the following command so my changes take effect without restarting the server container.

```
npm run watch
```

## Repository Etiquette <a id="Etiquette"></a>

- Name your branches in meaningful ways with the route at the start of the name. eg. `Users-POST-Login` or `Application-Swagger-Docs`.
- Delete branches once they have been merged into the routes main branch, there are currently 4 main branches for the existing routes `Users/Listings/Application/Offers`.

## QA Testing <a id="testing"></a>

All endpoint aside from Offers should have a selection of tests made using Jest and Supertest. Useful link from the Jest docs.

- https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

## Backend Board <a id="overview"></a>

Project board, add your task, iteration, status and assign yourself to them here;

https://github.com/orgs/NoroffFEU/projects/12/views/1

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

- Guide to getting started with your database. (In guide when creating a server it says use create/server, where as for me it was under register/server)
  https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/

- Prisma doc on PostgresSQL data base connection setup
  https://www.prisma.io/docs/concepts/database-connectors/postgresql
