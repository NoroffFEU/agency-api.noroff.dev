import express from "express";
import { handleLogin } from "./controllers/controllerLogin.js";
import { handleUpdate } from "./controllers/controllerUpdate.js";
import { handleDelete } from "./controllers/controllerDelete.js";
import validator from "express-validator";
const { body } = validator;
import { handleRegister } from "./controllers/controllerRegister.js";
import { checkIfUserIdExist } from "./middleware/userExists.js";
import { validateUserPermissions } from "./middleware/validateUserPermissions.js";
import { getAllUsers, getAUser } from "./controllers/controllerGet.js";

export const usersRouter = express.Router();

// POST /users
usersRouter.post(
  "/",
  body("email").isEmail(),
  body("firstName").isAlpha("nb-NO", { ignore: " -" }),
  body("lastName").isAlpha("nb-NO", { ignore: " -" }),
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
usersRouter.get("/", getAllUsers);

// GET /users/:id
usersRouter.get("/:id", checkIfUserIdExist, getAUser);

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
