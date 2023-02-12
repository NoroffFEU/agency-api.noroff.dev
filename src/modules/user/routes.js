import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { handleLogin } from "./controllers/controllerLogin.js";
import { handleUpdate } from "./controllers/controllerUpdate.js";
import { handleDelete } from "./controllers/controllerDelete.js";
import validator from "express-validator";
const { body } = validator;
import { handleRegister } from "./controllers/controllerRegister.js";

export const usersRouter = express.Router();

// POST /users
usersRouter.post(
  "/",
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: 20 }),
  handleRegister
);

//  POST /users/login
usersRouter.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: 20 }),
  handleLogin
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
