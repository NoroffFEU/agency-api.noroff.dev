import express from "express";
import { createListing } from "./controllers/controllerCreate.js";
import { updateListing } from "./controllers/controllerUpdate.js";
import { deleteListing } from "./controllers/controllerDelete.js";
import { getAllListings, getListingId } from "./controllers/controllerGet.js";
import { validatePermissions } from "./middleware/validatePermissions.js";
import { checkIfIdExist } from "./middleware/listingExists.js";
import { validateUser } from "./middleware/validateUser.js";

//listings router
export const listingsRouter = express.Router();

// GET
listingsRouter.get("/", getAllListings);

// GET:id
listingsRouter.get("/:id", checkIfIdExist, getListingId);

// POST
listingsRouter.post("/", validateUser, createListing);

// PUT:id
listingsRouter.put(
  "/:id",
  checkIfIdExist,
  validateUser,
  validatePermissions,
  updateListing
);

// DELETE:id
listingsRouter.delete(
  "/:id",
  checkIfIdExist,
  validateUser,
  validatePermissions,
  deleteListing
);
