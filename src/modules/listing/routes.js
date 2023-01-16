import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const listingsRouter = express.Router();

// Handling request using router
// GET /listings
listingsRouter
  .get("/", async (req, res) => {
    try {
      // Get listings from database
      const listings = await databasePrisma.listing.findMany();

      // Show the listings in browser
      res.status(200).json(listings);
    } catch (error) {
      // Show error message in browser
      res.status(500).json({ message: `internal server error`, statusCode: "500" });
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
        // res.status(404).json({ message: `There are no listings with an id of '${urlID}'` });
        return res
          .status(404)
          .json({ message: `Listing with id: ${req.params.id} doesn't exist.` });
      }

      res.status(200).json(uniqueListing);
    } catch (error) {
      res.status(500).json({ message: `internal server error`, statusCode: "500" });
    }
  });

// POST /listings
listingsRouter.post("/", async (req, res) => {
  try {
    const { title, tags, description, requirements, deadline, authorId } = req.body;

    const now = new Date().getTime();
    const valid = now < new Date(deadline).getTime();

    if (!valid) {
      res.status(400).json({ message: "Deadline must be greater than todays date" });
    } else if (title && tags && description && requirements && deadline && authorId) {
      const result = await databasePrisma.listing.create({
        data: {
          title: title,
          tags: tags,
          description: description,
          requirements: requirements,
          deadline: deadline,
          authorId: authorId,
        },
      });

      res.status(201).json(result);
    } else {
      res.status(400).json({ message: "Please fill in all required fields" });
    }
  } catch (e) {
    res.status(500).json({ message: `${e}` });
  }
});

// PUT /listings/:id
listingsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { deadline } = req.body;

  const now = new Date().getTime();
  const valid = now < new Date(deadline).getTime();
  console.log(valid);

  try {
    const listings = await databasePrisma.listing.update({
      where: {
        id: id,
      },
      data: {
        id: id,
        ...req.body,
      },
    });
    if (!valid) {
      res.status(200).json({
        data: {
          listings,
        },
      });
    } else {
      res.status(400).json({
        message: "deadline must be a future date",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    throw new Error(error, "An error occured in listingsRouter.put()");
  }
});

// DELETE /listings/:id
listingsRouter.delete("/:id", getListing, async (req, res) => {
  try {
    await databasePrisma.listing.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: `Listing with id: ${req.params.id} was deleted.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Middleware function that checks if listing with specified id does exist.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns "status 404" with error message if listing doesn't exist.
 */
async function getListing(req, res, next) {
  let listing;
  try {
    listing = await databasePrisma.listing.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (listing == null) {
      // return res.status(404).json({ message: `Listing with id: ${req.params.id} doesn't exist.` });
      return res.status(404).json({ message: `Listing with id: ${req.params.id} doesn't exist.` });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.listing = listing;
  next();
}
