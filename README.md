# agency.noroff.dev

## **Table of Contents**

1. [Installation Docker](#install-docker)
2. [Common Issues - Docker](#problems-docker)
3. [Installation PostgresSQL](#install-postgres)
4. [Common Issues - PostgresSQL](#problems-postgres)
5. [Repository Etiquette](#Etiquette)
6. [Testing & Test Data](#testing)
   - [Test Data](#test-data)
   - [Postman](#postman)
7. [Routes & API Usage](#routes)
8. [Backend Board & Task Overview](#overview)
9. [Utility Functions](#utilities)
10. [Useful Links & Resources](#resources)
11. [Dependencies](#dependencies)
12. [Contributions](#contributions)
13. [License](#license)

## Installation & Setup - Docker<a id="install-docker"></a>

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

When running the dev version I find unless I restart the server container manually, it will not update the server with any changes made to the code. This is not ideal, my work around is to stop the docker server container and
modify the .env database url to this.

```
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres?schema=schema"
```

Then run the server from VSC run the following command so my changes take effect without needing to constantly restart the server container.

```
npm run watch
```

## Installation & Setup - PostgresSQL<a id="install-postgres"></a>

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

- When working on a new feature create a new branch from the `dev` branch as this is typically the most up to date branch.
- Name your branches in meaningful ways with the issue number if present then the route, action/documentation and description. eg. `#11 Users - POST - Login Fixes` or `#13 Application - Swagge - Docs Updates`.
- Delete branches once they have been merged into the routes main or dev branch.
- There are currently 2 main branches for the repo that have protection the `main` and `dev` branches. The `main` branch is the production branch and should only be updated when a new version of the API is ready to be deployed. The `dev` branch is the development branch and should be used for all development work. When a feature is ready to be merged into the `dev` branch, create a pull request and assign it to a team member to review. Once the pull request has been reviewed and approved it can be merged into the `dev` branch. Periodically the `dev` branch will be merged into the `main` branch, this can be done when minor fixes take place or when all components of a feature have been put together and tested and are ready for deployment.

## Testing & Test Data<a id="testing"></a>

To run the tests use the following command in the root of the project.

```bash
npm run test
```

You can also test particular routes by using the following commands

```bash
npm run test-user
npm run test-application
npm run test-company
npm run test-listing
npm run test-offer
```

At the moment there are test passing tests for users, application, company and listing. The offers test still need more work. In each routes folder you will find a route.test.js file this is where all tests for that route should be written. The tests are written using Jest and Supertest. The tests are written in a way that they can be repeated, so you can run them as many times as you like.

### Test Data

Included in the prisma folder is a file called devSeed.js. This file contains a function that will generate test data for the database. To use this function you will need to run the following command in the root of the project, while your database and server are running.

```bash
npm run dev-seed
```

This will create a client, and applicant user, as well as a company, listing and application for said listing. It should only be run once, as it will attempt to create duplicate data if run again. The users Login details to get auth token:

```
Client
email: JohnCool@Client.com
password: password
Applicant
email: EggsBenedict@Applicant.com
password: password
```

Useful link from the Jest docs.

- https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

### Postman

When testing or working on the api I suggest using Postman or similar to test the routes. I have included some of the basic routes in a postman collection file that can be import into Postman. The file can be found in the root of the project, called `Noroff Job Agency - Postman Collection.json`. This file contains the following routes;

![routes image](./readme-images/Screenshot%202024-01-19%20122615.jpg)

You will want to also create an environment in Postman with the following variables, updating your tokens and urls to match your setup
![variables image](./readme-images/Screenshot%202024-01-19%20120505.jpg)

## Routes & API usage <a id="routes"></a>

Minion will be appointed to update this section with the routes and how to use them.

### Users

### Company

### Listing

### Application

### Offer

### Sorting and Filtering Get All Routes

At the moment there is sorting and filtering when getting all users, listings and companies. The sorting and filtering is done using query parameters. The following query parameters are available for each route.
I've added pagination, sorting, filtering like so, and expired flag for listings. You will find the page number and total pages in the response headers. Here is an example of how to use the query parameters.

```
page=1               // selects the page number
limit=5              // limits how many results you want

//these two both need to be included to work
includes=firstName   // A parameter that is non-relational (for the moment) on the model
includesValue=Alex   // The value to search for with the parameter

// how to sort the data
sortBy=created      // key to sort by
orderBy=asc         // how to sort it asc/desc

// on listings if you add this flag listing that have passed their deadlines will appear.
expired=true

//example fetch for users
http://127.0.0.1:4000/users?page=1&limit=5&includes=firstName&includesValue=Alex&sortBy=created&orderBy=asc
```

## Issues & Backend Project Board <a id="overview"></a>

The Backend project board can be found here;

https://github.com/orgs/NoroffFEU/projects/12/views/1

## Current Utility Functions <a id="utilities"></a>

In the `src/utilities` folder you will find a selection of reusable functions. Currently these include;

1. findUser.js - Find a user by `id` or `email`.
2. jsonWebToken.js - Sign and verify tokens.
3. mediaGuard.js - Verify a provided url is accessible.
4. password.js - Generate password hash, and compare plain text password to hash.
5. handlePrismaErrorResponses.js - Handle Prisma error responses and return a more user friendly error message.
6. prismaQueryGenerator.js - Generate a Prisma query based on query parameters, currently support users, companies and listings endpoints.

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

## Dependencies <a id="dependencies"></a>

- express
- prisma
- nodemon
- jest
- supertest
- bcrypt
- body-parser
- cors
- dotenv
- express-validator
- jsonwebtoken

## Contribution <a id="contributions"></a>

All contributions are welcome, please follow the repository etiquette and create a pull request for any changes you wish to make.

## License <a id="license"></a>

This project is licensed under the MIT License.
