import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { offers, offer } from "./read.js";

export const offersRouter = express.Router();

offersRouter.get("/", offers);
offersRouter.get("/:id", offer);
