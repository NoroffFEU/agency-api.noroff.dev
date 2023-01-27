import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const companyRouter = express.Router();

// Handling request using router
companyRouter.post("/", async (req, res) => {
  res.send("This is the company request");
});

companyRouter.put("/", async (req, res) => {});

companyRouter.get("/", async (req, res) => {});

companyRouter.get("/:id", async (req, res) => {});

companyRouter.delete("/", async (req, res) => {});
