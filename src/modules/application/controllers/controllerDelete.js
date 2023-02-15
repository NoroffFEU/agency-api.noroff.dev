import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

export const handleDelete = async function (req, res) {
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
    //check that the user who wants to delete is the same that put in the application
    if (verified.id !== applicationData.applicantId) {
      return res.status(401).json({
        message:
          "Unauthorized access: you cannot delete another user's application",
      });
    }

    try {
      const result = await databasePrisma.application.delete({
        where: { id: applicationId },
      });

      result.response = "Your Application was successfully deleted";

      return { status: 200, data: result.response };
    } catch (error) {
      return Promise.resolve({
        status: error.status,
        message: error.message,
      });
    }
  } else {
    return res.status(403).json({
      message: "Invalid token",
    });
  }
};
