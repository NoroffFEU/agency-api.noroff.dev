import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

export const handleEdit = async function (req, res) {
  const { id: applicationId } = req.params;
  const { coverLetter } = req.body;

  const applicationData = await databasePrisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!applicationData) {
    return res.status(404).json({ message: "Application not found" });
  }

  if (coverLetter === undefined) {
    return res.status(409).json({ message: "Cover letter is mandatory" });
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
    //check that the user who wants to update is the same that put in the application
    if (verified.id !== applicationData.applicantId) {
      return res.status(401).json({
        message:
          "Unauthorized access: you cannot update another user's application",
      });
    }

    try {
      const result = await databasePrisma.application.update({
        where: { id: applicationId },
        data: {
          coverLetter,
        },
      });

      result.response = "Your Application is updated successfully";

      return { status: 200, data: result };
    } catch (error) {
      return {
        status: error.status,
        message: error.message,
      };
    }
  } else {
    return res.status(403).json({
      message: "Invalid token",
    });
  }
};
