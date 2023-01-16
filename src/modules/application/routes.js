import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const applicationsRouter = express.Router();

// Handling request using router
applicationsRouter.get("/", async (req, res) => {
  res.send("This is the app request");
});

// POST /application

applicationsRouter.post("/", async (req, res) => {
  try {
    const { applicant, listing, coverLetter } = req.body;
    const result = await databasePrisma.application.create({
      data: {
        applicant,
        listing,
        coverLetter,
      },
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);

    const errorObject = await JSON.parse(err.message);
    if (errorObject.status) {
      res.status(errorObject.status).json(errorObject.message);
    } else {
      res.status(500).json("Internal server error.");
    }
  }
});
