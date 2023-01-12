import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { findUserByEmail } from "../../utilities/findUser.js";
import { verifyPassword, generateHash } from "../../utilities/password.js";
import { signToken } from "../../utilities/jsonWebToken.js";
import { verifyToken } from "../../utilities/jsonWebToken.js";
export const usersRouter = express.Router();

// POST /users
usersRouter.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { hash, salt } = await generateHash(password);
    const result = await databasePrisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hash,
        salt,
      },
    });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json({ message: "oops" });
  }
});

//  POST /users/login
usersRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const profile = await findUserByEmail(email);

    if (!profile) {
      throw new Error("Invalid email or password");
    }

    const correctPassword = await verifyPassword(profile, password);
    console.log(correctPassword);

    if (!correctPassword) {
      throw new Error("Invalid email or password");
    }

    let token;
    //Creating jwt token
    token = signToken(profile);

    res.status(200).json({
      ok: true,
      data: {
        userId: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        password: profile.password,
        token: token,
      },
    });
  } catch (err) {
    res.status(401).json(err.message);
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
