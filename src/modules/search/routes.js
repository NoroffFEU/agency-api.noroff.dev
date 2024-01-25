import express from "express";
import { searchListings } from "./controllers/searchListings.js";
import { searchCompanies } from "./controllers/searchCompanies.js";

//listings router
export const searchRouter = express.Router();

// GET Listings
searchRouter.get("/listings", searchListings);

// GET Companies
searchRouter.get("/companies", searchCompanies);

// // GET Applications
// searchRouter.get("/applications", searchApplications);

// // GET Offers
// searchRouter.get("/offers", searchOffers);
