import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { offers, offer } from "./read.js";
import { createOffer } from "./create.js";
import { removeOffer } from "./delete.js";

export const offersRouter = express.Router();

offersRouter.get("/", offers);
offersRouter.get("/:id", offer);

offersRouter.post("/", async (req, res) => {
  createOffer(databasePrisma, req, res);
});

offersRouter.delete("/:id", async (req, res) => {
  removeOffer(databasePrisma, req, res);
});
