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
    //Extract jwt from HTTP headers of request. Verify token and use response to resolve userId
    const token = req.headers.authorization;
    const userData = await verifyToken(token);
    if (!userData) {
      return res
        .status(401)
        .json({ message: "Missing valid authorization header" });
    }
    const userId = userData.id;

    //Use offerId from path-variable of request to find offer in database
    const offerId = req.params.id;
    const offer = await databasePrisma.offer.findUnique({
      where: {
        id: offerId,
      },
    });

    if (!offer) {
      return res.status(404).json({ message: "Invalid id for offer" });
    }

    //If the offers applicantId is the same as the userId of the request, we move on to next middleware or endpoint implementation.
    if (offer.userId === userId) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized to perform the requested operation" });
    }
  } catch (error) {
    console.error("Error in validateApplicantUpdate:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
