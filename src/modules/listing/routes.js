import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const listingsRouter = express.Router();

// Handling request using router
listingsRouter.get("/", async (req, res) => {
  res.send("This is the listing request");
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
        updated: new Date(),
        authorId: req.body.authorId,
      },
    });

    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
});
