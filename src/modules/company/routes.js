import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const companyRouter = express.Router();

// Handling request using router
companyRouter.get("/", async (req, res) => {
  res.send("This is the company request");
});
