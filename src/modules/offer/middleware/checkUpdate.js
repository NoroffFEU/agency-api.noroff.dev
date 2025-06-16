import { databasePrisma } from "../../../prismaClient.js";

export async function checkUpdate(req, res, next) {
  const { id } = req.params;
  const { state } = req.body;

  if (!state) {
    return res.status(400).json({
      message: "State is required in the request body.",
    });
  }

  try {
    const offer = await databasePrisma.offer.findUnique({
      where: {
        id: id,
      },
      include: {
        application: {
          include: {
            applicant: true,
          },
        },
        company: true,
      },
    });

    if (!offer) {
      return res.status(404).json({
        message: `Offer with ID ${id} not found.`,
      });
    }

    req.offer = offer;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred while checking the offer.",
      error: error.message,
    });
  }
}
