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
    res.status(400).json({ message: `${err}`, code: "400" });
  }
});
