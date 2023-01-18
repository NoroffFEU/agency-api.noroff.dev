import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { checkIfIdExist } from "./middleware/index.js";

export const listingsRouter = express.Router();

// Handling request using router
listingsRouter.get("/", async (req, res) => {
	const list = await databasePrisma.listing.findMany();
	res.send(list);
});

/**
 * DELETE listing endpoint.
 */
listingsRouter.delete("/:id", checkIfIdExist, async (req, res) => {
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

// PUT /listings/:id
listingsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { deadline } = req.body;

  const now = new Date().getTime();
  const newDeadline = new Date(deadline).getTime();
  const valid = now < newDeadline;

  if (!deadline) {
    res.status(400).json({ message: "deadline is required" });
  } else if (deadline !== undefined && !valid) {
    res.status(400).json({
      message: "deadline must be a future date",
    });
  }
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

    res.status(200).json({
      data: {
        listings,
      },
      message: `Listing updated successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    throw new Error(error, "An error occurred in listingsRouter.put()");


// POST /listings
listingsRouter.post("/", async (req, res) => {
  try {
    const { title, tags, description, requirements, deadline, authorId } =
      req.body;

    const now = new Date().getTime();
    const valid = now < new Date(deadline).getTime();

    if (!valid) {
      res
        .status(400)
        .json({ message: "Deadline must be greater than todays date" });
    } else if (
      title &&
      tags &&
      description &&
      requirements &&
      deadline &&
      authorId
    ) {
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

