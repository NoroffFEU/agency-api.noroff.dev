import express from "express";
import { databasePrisma } from "../../prismaClient";

export const putOffers = express.Router();

putOffers.put("/:id", (req, res) => {
  const { id } = req.params;

  res.send();
});
