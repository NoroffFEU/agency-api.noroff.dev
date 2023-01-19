import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import { Prisma } from "@prisma/client";
import { checkAuth } from "./controllers/checkAuth.js";
import { handleCreate } from "./controllers/controllerCreate.js";

export const applicationsRouter = express.Router();

applicationsRouter
    .get("/", checkAuth, async (req, res) => {
        try {
            const applications = await databasePrisma.application.findMany({
                include: { offers: true },
            });
            res.status(200).json(applications);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `internal server error`, code: "500" });
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
                res.status(404).json({ message: `no application found with id "${URLid}"` });
                return;
            }
            res.json(applicationById);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientValidationError) {
                res.status(400).send("mispelled url param");
            } else {
                res.status(500).send(`internal server error `);
            }
        }
    });

// Handling request using router
applicationsRouter.get("/", async (req, res) => {
  res.send("This is the app request");
});

// POST /application

applicationsRouter.post("/", async (req, res) => {
  try {
    // NEEDS MORE TESTING
    const result = await handleCreate(req);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    
    res.status(400).json({ message: `${err}`, code: "400" });
  }
});

// DELETE /application/:id
applicationsRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await databasePrisma.application.delete({
      where: {
        id: id,
      },
    });
    res
      .status(200)
      .json({
        message: "Succefully deleted application with id: " + id,
        code: "200",
      });
  } catch (err) {
    res.status(400).json({ message: `${err}`, code: "400" });
  }
});

    const errorObject = await JSON.parse(err.message);
    if (errorObject.status) {
      res.status(errorObject.status).json(errorObject.message);
    } else {
      res.status(500).json("Internal server error.");
    }
  });

