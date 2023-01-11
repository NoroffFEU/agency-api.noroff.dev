import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const applicationsRouter = express.Router();

// Handling request using router
applicationsRouter.get("/", async (req, res) => {
  res.send("This is the app request");
});
