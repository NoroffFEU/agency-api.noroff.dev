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

offersRouter.post("/", async (req, res) => {
  const { title, description, price, userId } = req.body;
  const offer = await databasePrisma.offer.create({
    data: {
      userId,
    },
  });
  res.send(offer);
});

offersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { state } = req.body;
  const offer = await databasePrisma.offer.update({
    where: {
      id: parseInt(id),
    },
    data: {
      state,
    },
  });
  res.send(offer);
});

offersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const offer = await databasePrisma.offer.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.send(offer);
});
