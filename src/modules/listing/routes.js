import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const listingsRouter = express.Router();

// Handling request using router
listingsRouter.get("/", async (req, res) => {
  res.send("This is the listing request");
});

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
