import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { offerGetId, offersGet } from "./read.js";

export const offersRouter = express.Router();

// Handling request using router

offersRouter.get("/", async (req, res) => {
  offersGet(databasePrisma, req, res);
});

offersRouter.get("/:id", async (req, res) => {
  offerGetId(databasePrisma, req, res);
});
