import { databasePrisma } from "../../../prismaClient.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const checkAccessRights = async (req, res, next) => {
  try {
    const { id: applicationId } = req.params;

    const applicationData = await databasePrisma.application.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!applicationData) {
      return res.status(404).json({ message: "Application not found" });
    }

    const token = req.headers.authorization;

    let readyToken = token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "User has to be authenticated to make this request" });
    } else if (token.includes("Bearer")) {
      readyToken = token.slice(7);
    }

    let verified = await verifyToken(readyToken);

    if (verified) {
      if (verified.id !== applicationData.applicantId) {
        return res.status(401).json({
          message:
            "Unauthorized access: you cannot update or delete another user's application",
        });
      }
    } else {
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "An unexpected error occurred.", ...error });
  }
};
