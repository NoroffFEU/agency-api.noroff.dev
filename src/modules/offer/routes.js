import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const offersRouter = express.Router();

// Handling request using router
offersRouter.get("/", async (req, res) => {
  res.send("This is the offers request");
});

offersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const offer = await databasePrisma.offer.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200);
});
