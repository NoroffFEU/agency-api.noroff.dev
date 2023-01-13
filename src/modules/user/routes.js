import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { generateHash } from "../../utilities/password.js";
import { handleLogin } from "./controllers/controllerLogin.js";
import { findUserById } from "../../utilities/findUser.js";
import {
  decodeToken,
  signToken,
  verifyToken,
} from "../../utilities/jsonWebToken.js";

export const usersRouter = express.Router();

// POST /users
usersRouter.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hash = await generateHash(password);
    const result = await databasePrisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hash,
      },
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: `${err}` });
  }
});

//  POST /users/login
usersRouter.post("/login", async (req, res) => {
  try {
    const data = await handleLogin(req);
    res.status(200).json(data);
  } catch (err) {
    console.log(err.message);

    const errorObject = await JSON.parse(err.message);
    if (errorObject.status) {
      res.status(errorObject.status).json(errorObject.message);
    } else {
      res.status(500).json("Internal server error.");
    }
  }
});

// GET /users
usersRouter.get("/", async (req, res) => {
  const users = await databasePrisma.user.findMany();
  res.json(users);
});

// GET /users/:id
usersRouter.get("/:id", async (req, res) => {});

// PUT /users/:id
usersRouter.put("/:id", async (req, res) => {
  //Finds the user
  const id = req.params.id;
  const user = await findUserById(id);
  //Throw 404 if user doesn't exist
  if (!user) {
    res.status(400).send("User not found");
    return;
  }
  //Make sure user has token and removes Bearer if need be
  const token = req.headers.authorization;
  var readyToken = token;
  if (!token) {
    res.status(401).send("User has to be authenticated to make this request");
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  if (readyToken) {
    var verified = verifyToken(readyToken);
    var tokenUser = decodeToken(readyToken);
  }

  //Throw 401 error if user isn't the correct user
  if (verified.userId != id || tokenUser.userId != id) {
    res.status(401).send("User does not match user to be edited");
  } else {
    try {
      // Updates the user
      const result = await databasePrisma.user.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      if (!error.status) {
        if (error.meta != undefined) {
          res
            .status(409)
            .send(
              `The input ${error.meta.target[0]} already exists for another user` +
                " " +
                error
            );
        } else {
          res
            .status(400)
            .send(
              "Argument value error it does not exist see details" +
                error.message
            );
        }
      } else {
        if (error.status) {
          res.status(error.status).send(error);
        } else {
          res.status(500).send("Internal server error.");
        }
      }
    }
  }
});

// DELETE /users/:id
usersRouter.delete("/:id", async (req, res) => {});
