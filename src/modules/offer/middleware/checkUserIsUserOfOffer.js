import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

/**
 * Middleware function that checks if the offer denoted by the id param, is created by the requesting user.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns "status 400" with error message if offer doesn't exist or "status 401" with error message if user doesn't exist or is not the applicant of the specified offer.
 */
export async function checkUserIsUserOfOffer(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Missing valid authorization header",
      });
    }

    let readyToken = token;
    if (token.includes("Bearer")) {
      readyToken = token.slice(7);
    }

    const userData = await verifyToken(readyToken);
    if (!userData) {
      return res.status(401).json({
        message: "Missing valid authorization header",
      });
    }

    req.user = userData;

    const offerId = req.params.id;
    const offer = await databasePrisma.offer.findUnique({
      where: {
        id: offerId,
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
      return res.status(404).json({ message: "Invalid id for offer" });
    }

    const isApplicant = offer.userId === userData.id;
    const isCompanyAdmin =
      userData.role === "Client" && offer.companyId === userData.companyId;

    if (isApplicant || isCompanyAdmin) {
      next();
    } else {
      return res.status(401).json({
        message: "Not authorized to perform the requested operation",
      });
    }
  } catch (error) {
    console.error("Error in checkUserIsUserOfOffer:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
