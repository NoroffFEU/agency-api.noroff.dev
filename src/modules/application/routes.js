import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { Prisma } from "@prisma/client";
import { checkAuth } from "./controllers/checkAuth.js";
import { handleCreate } from "./controllers/controllerCreate.js";
import { handleEdit } from "./controllers/controllerEdit.js";
import { handleDelete } from "./controllers/controllerDelete.js";
import { checkAccessRights } from "./middleware/index.js";

export const applicationsRouter = express.Router();

applicationsRouter
  .get("/", checkAuth, async (req, res) => {
    try {
      const applications = await databasePrisma.application.findMany({
        include: { offers: true },
      });
      res.status(200).json(applications);
    } catch (err) {
      res.status(500).json({ message: `Internal server error`, code: "500" });
    }
  })
  .get("/:id", checkAuth, async (req, res) => {
    try {
      const params = req.query;
      const URLid = req.params.id;
      const applicationById = await databasePrisma.application.findUnique({
        where: {
          id: URLid,
        },
        include: { _count: true, ...params },
      });
      if (applicationById === null) {
        res
          .status(404)
          .json({ message: `No application found with id "${URLid}"` });
        return;
      }
      res.json(applicationById);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        res.status(400).send("Misspelled url param");
      } else {
        res.status(500).send(`Internal server error `);
      }
    }
  })
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
