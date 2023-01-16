import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { generateHash } from "../../utilities/password.js";
import { handleLogin } from "./controllers/controllerLogin.js";
import { createThrownError } from "../../utilities/errorMessages.js";
import { handleUpdate } from "./controllers/controllerUpdate.js";
import validator from "express-validator";
const { body, validationResult } = validator;
import { signToken } from "../../utilities/jsonWebToken.js";
import { handleRegister } from "./controllers/controllerRegister.js";


export const usersRouter = express.Router();

// POST /users
usersRouter.post(
  "/",
  // email must be actual email
  body("email").isEmail(),
  // password must be at least 5 chars long
  body("password").isLength({ min: 5, max: 20 }),
  async (req, res) => {
    try {
      // returns with errors if any
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const data = await handleRegister(req);
      if (data.status === 409) {
        return res.status(409).json({ message: "User already exists" });
      }
      if (data.status === 400) {
        return res.status(400).json({ message: "Bad image url" });
      }
      res.status(201).json(data);
    } catch (err) {
      // Send a 500 error if there was a problem with the insertion
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//  POST /users/login
usersRouter.post(
  "/login", // email must be actual email
  body("email").isEmail(),
  // password must be at least 5 chars long
  body("password").isLength({ min: 5, max: 20 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { status, data } = await handleLogin(req);
      res.status(status).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ ...error, message: "Internal server error." });
    }
  }
);

// GET /users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await databasePrisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ ...error, message: "Internal server error" })
  }
});

// GET /users/:id
usersRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await databasePrisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw createThrownError(404, "Could not find user!");
    }

    if (id === undefined) {
      throw createThrownError(400, "Bad request, user id is undefined");
    }

    res.status(200).json(user);
  } catch (err) {
    const errorObject = await JSON.parse(err.message);
    if (errorObject.status) {
      res.status(errorObject.status).json(errorObject.message);
    } else {
      res.status(400).json("User does not exist.");
    }
  }
});

// PUT /users/:id
usersRouter.put("/:id", async (req, res) => {
  try {
    const data = await handleUpdate(req);
    res.status(200).json(data);
  } catch (error) {
    res.json(error.message);
  }
});

// DELETE /users/:id
usersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await databasePrisma.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(400).json({
      message: `${error}`,
    });
  }
});
