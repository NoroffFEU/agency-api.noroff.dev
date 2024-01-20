import { databasePrisma } from "../../../prismaClient.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const validateAdminUpdate = async function (req, res, next) {
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    return res
      .status(401)
      .json({ message: "No authorization header provided." });
  }

  // Check if token is valid
  const verified = await verifyToken(token.replace(/^Bearer\s/, ""));
  if (!verified) {
    return res.status(401).json({
      message: "Invalid authorization token provided, please re-log.",
    });
  }

  const user = verified;
  const offerId = req.params.id;

  // Check if offer exists and belongs to the company
  const offer = await databasePrisma.offer.findUnique({
    where: {
      id: offerId,
    },
    select: {
      companyId: true,
    },
  });

  // Check if the user is authorized to update the offer
  if (user.role !== "Admin" && user.companyId !== offer.companyId) {
    return res
      .status(401)
      .json({ message: "You are not authorized to update this offer." });
  }

  next();
};
