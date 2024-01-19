import { databasePrisma } from "../../../prismaClient.js";

export async function checkUpdate(req, res, next) {
  const { companyId, offerId, state } = req.body;

  //check if the request body contains the required fields
  if (!companyId) {
    res.status(400).json({
      message: "Company ID is missing from the request body.",
    });
  }

  if (!offerId) {
    res.status(400).json({
      message: "Offer ID is missing from the request body.",
    });
  }

  if (!state) {
    res.status(400).json({
      message: "No state has been provided for the update.",
    });
  }

  try {
    // Check if company exists
    const company = await databasePrisma.company.findUnique({
      where: {
        id: companyId,
      },
    });
    if (!company) {
      res.status(404).json({
        message: `Company with ID ${companyId} not found.`,
      });
    }

    // Check if offer exists and belongs to the company
    const offer = await databasePrisma.offer.findUnique({
      where: {
        id: offerId,
      },
      select: {
        companyId: true,
      },
    });

    if (!offer) {
      res.status(404).json({
        message: `Offer with ID ${offerId} not found.`,
      });
    }
    if (offer.companyId !== companyId) {
      res.status(404).json({
        message: `Offer with ID ${offerId} does not belong to company with ID ${companyId}.`,
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An unexpected error occurred while updating the offer.",
    });
  }
}
