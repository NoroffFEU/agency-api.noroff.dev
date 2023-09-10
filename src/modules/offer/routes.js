import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { offersGet, offerGetId } from "./controllers/read.js";
import { createOffer } from "./controllers/create.js";
import { removeOffer } from "./controllers/delete.js";
import { updateOffer } from "./controllers/update.js";
import { checkUpdate } from "./middleware/checkUpdate.js";
import { validateAdminUpdate } from "./middleware/validateAdminUpdate.js";

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

//use this when admin is updating offer
offersRouter.put("/:id", checkUpdate, validateAdminUpdate, async (req, res) => {
  updateOffer(databasePrisma, req, res);
});

offersRouter.delete(
  "/:id",
  checkUpdate,
  validateAdminUpdate,
  async (req, res) => {
    removeOffer(databasePrisma, req, res);
  }
);

//use this when user is updating offer status
offersRouter.put("/user/:id", async (req, res) => {
  updateOffer(databasePrisma, req, res);
});
