import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

export const handleEdit = async function (req) {
  const { id: applicationId } = req.params;
  const { coverLetter } = req.body;

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

  if (coverLetter === undefined) {
    return Promise.resolve({
      status: 409,
      message: "Cover letter is mandatory",
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
    //check that the user who wants to update is the same that put in the application
    if (verified.id !== applicationData.applicantId) {
      return Promise.resolve({
        status: 401,
        data: {
          message:
            "Unauthorized access: The user attempting the update does not match the user who made the original request.",
        },
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
