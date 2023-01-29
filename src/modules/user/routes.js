import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { handleLogin } from "./controllers/controllerLogin.js";
import { handleUpdate } from "./controllers/controllerUpdate.js";
import { handleDelete } from "./controllers/controllerDelete.js";
import validator from "express-validator";
const { body, validationResult } = validator;
import { verifyToken } from "../../utilities/jsonWebToken.js";
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
        return res.status(400).json({
          message: `${errors.array()[0].msg} in ${errors.array()[0].param}${
            errors.array()[1] ? " and " + errors.array()[1].param : ""
          } field(s)`,
        });
      }
      const data = await handleRegister(req);
      if (data.status === 409) {
        return res.status(409).json({ message: "User already exists" });
      }
      if (data.status === 400) {
        return res.status(400).json({ message: "Bad image url" });
      }
      res.status(201).json(data);
    } catch (error) {
      // Send a 500 error if there was a problem with the insertion
      console.error(error);
      res.status(500).json({ ...error, message: "Internal server error" });
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
        return res.status(400).json({
          message: `${errors.array()[0].msg} in ${errors.array()[0].param}${
            errors.array()[1] ? " and " + errors.array()[1].param : ""
          } field(s)`,
        });
      }

      const { status, data } = await handleLogin(req);

      console.log(await verifyToken(data.token));
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
    const users = await databasePrisma.user.findMany({
      include: {
        company: true,
      },
    });

    users.forEach((user) => {
      delete user.password;
      delete user.salt;
    });

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
});

// GET /users/:id
usersRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id === undefined) {
      return res
        .status(400)
        .json({ message: "Bad request, user id is undefined" });
    }

    const user = await databasePrisma.user.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Could not find user!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
});

// PUT /users/:id
usersRouter.put("/:id", async (req, res) => {
  try {
    const { status, data } = await handleUpdate(req);
    res.status(status).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
});

// DELETE /users/:id
usersRouter.delete("/:id", async (req, res) => {
  try {
    const { status, data } = await handleDelete(req);
    res.status(status).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
});
