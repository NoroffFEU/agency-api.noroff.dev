import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { createCompany } from "./controllers/createCompany.js";

export const companyRouter = express.Router();

companyRouter.get("/list", async (req, res) => {
  databasePrisma.company
    .findMany({
      include: {
        applications: true,
        offers: true,
        listings: true,
        admin: true,
      },
    })
    .then((companies) => {
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
