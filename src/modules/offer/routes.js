import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { offersGet, offerGetId } from "./controllers/controllerRead.js";
import { createOffer } from "./controllers/controllerCreate.js";
import { removeOffer } from "./controllers/controllerDelete.js";
import { updateOffer } from "./controllers/controllerUpdate.js";
import { checkUserIsUserOfOffer } from "./middleware/checkUserIsUserOfOffer.js";
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

offersRouter.put("/:id", checkUserIsUserOfOffer, async (req, res) => {
  const userId = req.user?.id;
  updateOffer(databasePrisma, req, res, userId);
});

offersRouter.delete("/:id", validateAdminUpdate, async (req, res) => {
  removeOffer(databasePrisma, req, res);
});
