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

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: `${err}` });
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
usersRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userId = await databasePrisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(userId);
  } catch (error) {
    res.status(401).json({
      message: "Something went wrong",
    });
  }
});

// PUT /users/:id
usersRouter.put("/:id", async (req, res) => {});

// DELETE /users/:id
usersRouter.delete("/:id", async (req, res) => {});
