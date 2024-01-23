import express from "express";
import { searchListings } from "./controllers/searchListings";

//listings router
export const searchRouter = express.Router();

// GET Listings
searchRouter.get("/listings", searchListings);

// // GET Companies
// searchRouter.get("/companies", searchCompanies);

// // GET Users
// searchRouter.get("/users", searchUsers);

// // GET Applications
// searchRouter.get("/applications", searchApplications);

// // GET Offers
// searchRouter.get("/offers", searchOffers);
