import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const listingsRouter = express.Router();

// Handling request using router
listingsRouter
  .get("/", async (req, res) => {
    try {
      // Get listings from database
      const listings = await databasePrisma.listing.findMany();

      // Show the listings in browser
      res.status(200).json(listings);
    } catch (error) {
      res.status(500).json({ message: `Internal server error`, statusCode: "500" });
    }
  })
  .get("/:id", async (req, res, next) => {
    try {
      // Get id from url
      const urlID = req.params.id;

      const uniqueListing = await databasePrisma.listing.findUnique({
        where: {
          id: urlID,
        },
      });

      // Check to see if array is empty
      if (uniqueListing === null) {
        res.status(404).json({ message: `Listing with id ${urlID} doesn't exist.` });
      }

      res.status(200).json(uniqueListing);
    } catch (error) {
      res.status(500).json({ message: `Internal server error`, statusCode: "500" });
    }
  });
