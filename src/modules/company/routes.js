import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { createCompany } from "./controllers/createCompany.js";

export const companyRouter = express.Router();

// Handling request using router
companyRouter.get("/", async (req, res) => {
  res.send("This is the company request");
});

companyRouter.get("/list", async (req, res) => {
  databasePrisma.company.findMany().then((companies) => {
    res.send(companies);
  });
});

companyRouter.post("/", async (req, res) => {
  createCompany(databasePrisma, req, res);
});

companyRouter.put("/", async (req, res) => {});

companyRouter.get("/", async (req, res) => {});

companyRouter.get("/:id", async (req, res) => {});

companyRouter.delete("/", async (req, res) => {});
