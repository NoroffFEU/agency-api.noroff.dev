import { databasePrisma } from "../../../prismaClient.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const validateApplicantUpdate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const userInfo = await verifyToken(token);
    const userId = userInfo.id;

    const id = req.params.id;
    const offer = await databasePrisma.offer.findUnique({
      where: {
        id,
      },
    });

    if (offer.userId !== userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    next();
  } catch (error) {
    console.error("Error in validateApplicantUpdate:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
