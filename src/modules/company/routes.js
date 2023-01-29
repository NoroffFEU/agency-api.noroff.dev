import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { createCompany } from "./controllers/createCompany.js";
import { findCompanyById } from "./controllers/findCompanyById.js";

export const companyRouter = express.Router();

// Endpoint to get all companies in a list

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

// Endpoint to get a company by id

companyRouter.get("/:id", async (req, res) => {
  findCompanyById(databasePrisma, req, res);
});

// Endpoint to create a company

companyRouter.post("/", async (req, res) => {
  createCompany(databasePrisma, req, res);
});

companyRouter.put("/", async (req, res) => {});

companyRouter.get("/", async (req, res) => {});

companyRouter.get("/:id", async (req, res) => {});

companyRouter.delete("/", async (req, res) => {});
