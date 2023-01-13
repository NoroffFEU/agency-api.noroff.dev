# agency.noroff.dev

## Installation

Clone the repo in your desired manner.

Install dependencies

```
npm i
```

Create a .env file and fill in require details

```
DATABASE_URL="postgresql://username:password@databaseUrl:Port/databaseName?schema=schema"
PORT=NUMBER
SECRETSAUCE=RANDOMSTRING
```

Start server with nodemon

```
npm run watch
```

You can check your server is running using Postman or similar software by placing a GET request to `/applications` `/listings` `/offers` end points which should return a message.

```
http://localhost:PORT/applications
```

You will need a PostgresSQL database setup and running. Can be downloaded from here, https://www.postgresql.org/.

Guide to getting started with your database. (In guide when creating a server it says use create/server, where as for me it was under register/server)
https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/

Prisma doc on PostgresSQL data base connection setup
https://www.prisma.io/docs/concepts/database-connectors/postgresql

When first connecting to your empty database generate the tables using

```
npx prisma migrate dev --name init
```

Then generate the prisma client using

```
npx prisma generate
```

To test your database you can POST on the `/users` endpoint, in Postman with a body set to raw JSON, and setting a content type of JSON in the request headers.

```
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "something@something.com",
  "password": "password"
}
```

Then user GET on the `/users` endpoint to get the user you just registered back.

### Utilities

I have added a utilities folder in the src with a basic setup for signing and verifying json web tokens that can be used in your testing although we might want to discuss using a setup similar to the linked article below with a refresh token.

https://medium.com/@prashantramnyc/authenticate-rest-apis-in-node-js-using-jwt-json-web-tokens-f0e97669aad3

### setup notes

```
npm install -D prisma dotenv nodemon

npm install express @prisma/client body-parser bcrypt jsonwebtoken

npx prisma

npm prisma init

npx prisma migrate dev --name init

npx prisma generate
```
