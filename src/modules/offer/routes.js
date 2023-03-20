import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { offersGet, offerGetId } from "./controllers/read.js";
import { createOffer } from "./controllers/create.js";
import { removeOffer } from "./controllers/delete.js";
import { updateOffer } from "./controllers/update.js";
import { updateApplicantOffer } from "./controllers/updateApplicantOffer.js";

export const offersRouter = express.Router();

offersRouter.get("/", async (req, res) => {
  offersGet(databasePrisma, req, res);
});

offersRouter.get("/:id", async (req, res) => {
  offerGetId(databasePrisma, req, res);
});

offersRouter.post("/", async (req, res) => {
  createOffer(databasePrisma, req, res);
});

offersRouter.put("/:id", async (req, res) => {
  updateOffer(databasePrisma, req, res);
});

offersRouter.put("/applicant/:id", async (req, res) => {
  updateApplicantOffer(databasePrisma, req, res);
});

offersRouter.delete("/:id", async (req, res) => {
  removeOffer(databasePrisma, req, res);
});
