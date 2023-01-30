import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { createCompany } from "./controllers/createCompany.js";
import { findCompanyById } from "./controllers/findCompanyById.js";
import { deleteCompany } from "./controllers/deleteCompany.js";
import { findAllCompanies } from "./controllers/findAllCompanies.js";

export const companyRouter = express.Router();

// Endpoint to get all companies in a list

companyRouter.get("/list", async (req, res) => {
  findAllCompanies(databasePrisma, req, res);
});

// Endpoint to get a company by id

companyRouter.get("/:id", async (req, res) => {
  findCompanyById(databasePrisma, req, res);
});

// Endpoint to create a company

companyRouter.post("/", async (req, res) => {
  createCompany(databasePrisma, req, res);
});

// Endpoint to update a company

companyRouter.put("/", async (req, res) => {});

// Endpoint to delete a company

companyRouter.delete("/", async (req, res) => {
  deleteCompany(databasePrisma, req, res);
});
