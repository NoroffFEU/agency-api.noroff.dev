import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const offersRouter = express.Router();

// Handling request using router
offersRouter.get("/", async (req, res) => {
  res.send("This is the offers request");
});
