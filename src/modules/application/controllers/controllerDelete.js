import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

export const handleDelete = async function (req) {
  const { id: applicationId } = req.params;

  const applicationData = await databasePrisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!applicationData) {
    return Promise.resolve({
      status: 404,
      message: "Application not found",
    });
  }

  const token = req.headers.authorization;

  let readyToken = token;
  if (!token) {
    return Promise.resolve({
      status: 401,
      message: "User has to be authenticated to make this request",
    });
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  let verified;

  if (readyToken !== undefined) {
    try {
      verified = await verifyToken(readyToken);
    } catch (error) {
      return Promise.resolve({ status: 401, message: "Auth token not valid." });
    }
  }

  if (verified) {
    //check that the user who wants to delete is the same that put in the application
    if (verified.id !== applicationData.applicantId) {
      return Promise.resolve({
        status: 401,
        data: {
          message:
            "Unauthorized access: The user attempting the delete does not match the user who made the original request.",
        },
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
    return Promise.resolve({
      status: 403,
      message: "Invalid token",
    });
  }
};
