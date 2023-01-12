import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const usersRouter = express.Router();

// POST /users
usersRouter.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const result = await databasePrisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        salt: "salty",
      },
    });

    res.json(result);
  } catch (err) {
    console.log(err);
    res.json({ message: "oops" });
  }
});

//  POST /users/login
usersRouter.post("/login", async (req, res) => {});

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
