import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const offersRouter = express.Router();

// Handling request using router
// offersRouter.put("/:id", async (req, res) => {
//   const { id } = req.params;
