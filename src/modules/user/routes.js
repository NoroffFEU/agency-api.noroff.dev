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
import { toggleFavorite } from "./controllers/controllerFavorites.js";
import { verifyToken } from "../../utilities/jsonWebToken.js";

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

// Middleware for authentication
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    let readyToken = token;
    if (token.includes("Bearer")) {
      readyToken = token.slice(7);
    }

    const user = await verifyToken(readyToken);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

const validateApplicantRole = (req, res, next) => {
  if (req.user.role !== "Applicant") {
    return res.status(403).json({
      message: "Only Applicant users can manage favorite listings",
    });
  }
  next();
};

// Toggle favorite listing
usersRouter.post(
  "/favorites",
  authenticateUser,
  validateApplicantRole,
  async (req, res) => {
    toggleFavorite(req, res);
  }
);
