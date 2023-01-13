import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const listingsRouter = express.Router();

// Handling request using router
listingsRouter.get("/", async (req, res) => {
  const listings = await databasePrisma.listing.findMany();
  res.status(200).json(listings);
});
listingsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listings = await databasePrisma.listing.findUnique({
    where: {
      id: id,
    },
  });
  res.status(200).json(listings);
});

listingsRouter.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const result = await databasePrisma.listing.create({
      data: {
        title: req.body.title,
        tags: req.body.tags,
        description: req.body.description,
        requirements: req.body.requirements,
        deadline: req.body.deadline,
        authorId: req.body.authorId,
      },
    });

    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
});

listingsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { deadline } = req.body;

  const now = new Date().toISOString();
  const deadlineToString = new Date(deadline).toISOString();

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
    if (deadlineToString > now) {
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
    throw new Error(error, "An error occured in listingsRouter.put()");
  }
});

// TODO: make sure you can only edit your own listings
