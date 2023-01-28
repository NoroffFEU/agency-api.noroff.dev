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
      //NEEDS MORE TESTING
      const result = await handleCreate(req, res);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: `${err}`, code: "400" });
    }
  })
  .delete("/:id", checkAuth, async (req, res) => {
    try {
      const id = req.params.id;
      await databasePrisma.application.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message: `Successfully deleted application with id: ${id}`,
        code: "200",
      });
    } catch (err) {
      res.status(400).json({ message: `${err}`, code: "400" });
    }
  });

applicationsRouter.put("/:id", (req, res) => {
  const { applicantId, listingId } = req.body;

  if (!listingId || !applicantId) {
    res.sendStatus(400);
    return;
  }

  res.send({
    applicationId: "2904fd0c-92dc-4bea-b78f-0948cdc95416",
    applicantId: "0c3fd305-e8bb-43d5-8f3f-bdb405dfed96",
    listingId: "91f5004b-df7e-4cc8-aaee-8703f14c031c",
    coverLetter: "This is my updated cover letter",
    created: "",
    updated: "",
  });
});
