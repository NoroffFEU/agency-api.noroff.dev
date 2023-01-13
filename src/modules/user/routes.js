import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { generateHash } from "../../utilities/password.js";
import { handleLogin } from "./controllers/controllerLogin.js";

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
usersRouter.put("/:id", async (req, res) => {});

// DELETE /users/:id
usersRouter.delete("/:id", async (req, res) => {});
