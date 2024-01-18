# Express and Prisma

## Table of Contents

1. [Routes](#routes)
2. [Middleware](#middleware)
3. [Json Web Tokens](#json-web-tokens)

## Routes

You have probably seen `app.get(...)` in the examples you have been studying,

```js
app.get(`users/`, (req, res) => {
  getAllUsers(req, res);
});
```

In order to try and modularise the code and avoid having all the endpoints in the main `app.js` file we have split them up into routes.
The code is structure in a way that each main table in the database has its own route. To create a route we import express and use `Router()`.

```js
import express from "express";
export const userRouter = express.Router();
```

We then apply are methods to the router, the `getAllUsers()` function is a controller for the end point we pass the `req` and `res` in to allow us to return response directly in the function.

```js
usersRouter.get("/", async (req, res) => {
  getAllUsers(req, res);
});
```

This can also be simplified to, without the need to explicitly state the passing of the `req` and `res` into the function.

```js
usersRouter.get("/", getAllUsers);
```

A simplified version of the getAllUsers function would look something like this using Prisma

```js
export const getAUser = async function (req, res) {
  try {
    //get the id params
    const id = req.params.id;

    /* check the database, in the user table for the id provided, if you were checking for example 
      a listing you would use databasePrisma.listing.findUnique()*/
    const user = await databasePrisma.user.findUnique({
      where: {
        id,
      },
    });

    // return a 200 status code and the user data as json
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ ...error, message: "Internal server error" });
  }
};
```

Once are methods are setup we take the exported route and apply it in the `app.js`.

```js
app.use("/users", usersRouter);
```

This approach allows us to cleanly setup new routes and add them to the `app.js`.

```js
app.use("/users", usersRouter);
app.use("/applications", applicationsRouter);
app.use("/listings", listingsRouter);
app.use("/offers", offersRouter);
app.use("/company", companyRouter);
```

## Middleware

This is a function that can be applied to a method before the main controller function, take for instance the get user by id endpoint, here we have a function to check the id exists before getting to the main controller.

```js
usersRouter.get("/:id", checkIfUserIdExist, getAUser);
```

This allows us to reuse the id check middleware function in endpoints that need it like so.

```js
usersRouter.get("/:id", checkIfUserIdExist, getAUser);
usersRouter.put("/:id", checkIfUserIdExist, handleUpdate);
usersRouter.delete("/:id", checkIfUserIdExist, handleDelete);
```

So lets take a look at this middleware. First thing you might notice, are the parameters for the function we have `next`, in express this is used to tell express to move onto the next function on the endpoint. So we perform are database search if a user is found we run the `next()` then the it moves onto the controller function. But if this check fails we return a response from the function, and the processing of the request doesn't go any further.

```js
import { databasePrisma } from "../../../prismaClient.js";

export async function checkIfUserIdExist(req, res, next) {
  try {
    const user = await databasePrisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: `User with id doesn't exist.` });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
```

Another useful thing if you want to pass information from one function to another you can do this by attaching it to the `req`, as seen in the previous function using.

```js
req.user = user;
```

Then you can get this in the next function, saving on code writing and making multiple requests to the database for the same info. (Be careful not to overwrite any information on the request when doing this.)

```js
const user = req.user;
```

When you look through the code for the project you will see one or more middleware functions running in succession that must be passed before a request is handled by its controller.

```js
// GET /users/:id
usersRouter.get("/:id", checkIfUserIdExist, getAUser);

// PUT /users/:id
usersRouter.put("/:id", checkIfUserIdExist, validateUserPermissions, handleUpdate);

// DELETE /users/:id
usersRouter.delete("/:id", checkIfUserIdExist, validateUserPermissions, handleDelete);
```

## Json Web Tokens

For this project we are using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package to validate a users requests. In the `src/utilities/jsonWebToken.js` file you will 3 functions for dealing with these tokens. I go over the two important ones for what we are doing. First we have the signToken function this takes the `sign` function from the package and uses the users id and email plus a secret key `(SECRETSAUCE)` to create a unique token for the user. Currently set to expire in 24hrs.

```js
import jsonwebtoken from "jsonwebtoken";
const { sign, decode, verify } = jsonwebtoken;

export function signToken({ id, email }) {
  const token = sign({ userId: id, email: email }, process.env.SECRETSAUCE, {
    expiresIn: "24h",
  });
  return token;
}
```

If any of the user data in this key is modified it will return as an invalid token, we store the id and email in it as these are unique identifiers for a user and can be used to find them in the database. The secret key is used as the encoding key for the token so without it a token can't be verified.

Bring us the second important function, verifyToken. Here we use the `verify` function taking the secret key to validate the token, if it is a valid token it returns the encoded users id and email, otherwise it will return null/false. To prevent problems with users being able to delete themselves and still technically have a valid token, an additional check was added to make sure the user still exists in the database.

```js
import jsonwebtoken from "jsonwebtoken";
const { sign, decode, verify } = jsonwebtoken;
import { findUserById } from "./findUser.js";

export async function verifyToken(token) {
  try {
    // verify token using secret key, returning user id and email on success or false on failure
    const data = verify(token, process.env.SECRETSAUCE);

    // if the token is verified the data is checked against the database
    if (data) {
      const user = await findUserById(data.userId);
      //if the user exist we return the user profile
      if (user) {
        return Promise.resolve(user);
      }
    }
    //if the token isn't valid or the user doesn't exist returns false
    return false;
  } catch (error) {
    return false;
  }
}
```

So lets look at a practical use, using the validateUserPermissions function mentioned in the previous example. So are endpoint is setup like so

```js
usersRouter.delete("/:id", checkIfUserIdExist, validateUserPermissions, handleDelete);
```

We can pick up the user info using `req.user` from the checkIfUserIdExists middleware, then we can get the authorization header in express using `req.headers.authorization`.

```js
export const validateUserPermissions = async function (req, res, next) {
  const user = req.user;
  const token = req.headers.authorization;
  ......

  next()
};
```

Taking this token verify the users identity, and match it to the target of the request before allowing the request to be passed onto the controller.

```js
export const validateUserPermissions = async function (req, res, next) {
  const user = req.user;
  const token = req.headers.authorization;

  //first we check the token is present, if it is not provided it will be undefined.
  let readyToken = token;
  if (token === undefined) {
    return res.status(401).json({ message: "No authorization header provided." });

    // In this case we check for "Bearer" being present, but front end was told to add this for all requests.
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  //With Bearer removed we use the verifyToken function to validate the token, return error message on failure
  const verified = await verifyToken(readyToken);
  if (!verified) {
    return res.status(401).json({
      message: "Invalid authorization token provided, please re-log.",
    });
  }

  // we then check that the verified users id matches the id of the user, with an exception for admins.
  if (verified.id !== user.id && verified.role !== "Admin") {
    return res.status(401).json({ message: "You can not edit another users profile." });
  }

  // with the token verified, and matched to the target user the request can be passed to the controller.
  next();
};
```
