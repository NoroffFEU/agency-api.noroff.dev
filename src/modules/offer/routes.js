import express from "express";
import { databasePrisma } from "../../prismaClient.js";

export const offersRouter = express.Router();

// Handling request using router
offersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;

  const {
    listingId,
    applicationId,
    userId,
    applicantId,
    userRole,
    offerState,
  } = req.body;

  try {
    const offer = await databasePrisma.offer.update({
      where: {
        id: id,
      },
      data: {
        id: id,
        ...req.body,
      },
    });

    res.status(200).json(offer);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});
