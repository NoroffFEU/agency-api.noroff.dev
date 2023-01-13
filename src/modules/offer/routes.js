import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const offersRouter = express.Router();

// Handling request using router
offersRouter.get("/", async (req, res) => {
  res.send("This is the offers request");
});

offersRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await databasePrisma.offer.findUnique({
      where: {
        id: String(id),
      },
    });
    if (!offer) {
      res.status(404).json({ message: "Offer not found" });
      return;
    }
    res.send(offer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
});
