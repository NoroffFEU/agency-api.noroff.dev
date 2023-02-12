import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { handleLogin } from "./controllers/controllerLogin.js";
import { handleUpdate } from "./controllers/controllerUpdate.js";
import { handleDelete } from "./controllers/controllerDelete.js";
import validator from "express-validator";
const { body } = validator;
import { handleRegister } from "./controllers/controllerRegister.js";
import { checkIfUserIdExist } from "./middleware/userExists.js";
import { validateUserPermissions } from "./middleware/validateUserPermissions.js";

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
usersRouter.get("/:id", checkIfUserIdExist, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await databasePrisma.user.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
});

// PUT /users/:id
usersRouter.put(
  "/:id",
  checkIfUserIdExist,
  validateUserPermissions,
  handleUpdate
);

// DELETE /users/:id
usersRouter.delete(
  "/:id",
  checkIfUserIdExist,
  validateUserPermissions,
  handleDelete
);
