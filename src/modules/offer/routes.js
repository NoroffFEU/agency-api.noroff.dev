import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const offersRouter = express.Router();

// Handling request using router
offersRouter.get("/", async (req, res) => {
  res.send("This is the offers request");
});

offersRouter.post("/offers/create", async (req, res) => {
  try {
    const {
      listingId,
      applicationId,
      userId,
      applicantId,
      userRole,
      offerState,
    } = req.body;

    const offer = await databasePrisma.offer.create({
      data: {
        listingId: listingId,
        applicationId: applicationId,
        userId: userId,
        applicantId: applicantId,
        applicant: userRole,
        state: offerState,
      },
    });

    res.status(200).json(offer);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});
