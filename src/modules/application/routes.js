import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { Prisma } from "@prisma/client";
import { checkAuth } from "./controllers/checkAuth.js";
import { handleCreate } from "./controllers/controllerCreate.js";
import { handleEdit } from "./controllers/controllerEdit.js";
import { handleDelete } from "./controllers/controllerDelete.js";
import {
  findAllApplications,
  findApplicationById,
} from "./controllers/controllerRead.js";
import { checkAccessRights } from "./middleware/index.js";

export const applicationsRouter = express.Router();

applicationsRouter
  .get("/", checkAuth, findAllApplications)
  .get("/:id", checkAuth, findApplicationById)
  .post("/", checkAuth, async (req, res) => {
    try {
      await handleCreate(req, res);
    } catch (err) {
      res.status(400).json({ message: `${err}`, code: "400" });
    }
  })
  .delete("/:id", checkAccessRights, async (req, res) => {
    try {
      await handleDelete(req, res);
    } catch (err) {
      const errorObject = await JSON.parse(err.message);
      if (errorObject.status) {
        res.status(errorObject.status).json(errorObject.message);
      } else {
        res.status(500).json("Internal server error.");
      }
    }
  })
  .put("/:id", checkAccessRights, async (req, res) => {
    try {
      await handleEdit(req, res);
    } catch (err) {
      const errorObject = await JSON.parse(err.message);
      if (errorObject.status) {
        res.status(errorObject.status).json(errorObject.message);
      } else {
        res.status(500).json("Internal server error.");
      }
    }
  });
