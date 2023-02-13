import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

export const handleEdit = async function (req) {
  const { id: applicationId } = req.params;
  const { coverLetter } = req.body;

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
      verified = verifyToken(readyToken);
    } catch (error) {
      return Promise.resolve({ status: 401, message: "Auth token not valid." });
    }
  }

  if (verified) {
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
      if (!error.status) {
        if (error.meta !== undefined) {
          return Promise.resolve({
            status: 409,
            message: `You've already updated your application`,
          });
        } else {
          return Promise.resolve({
            status: 409,
            message: `${error.message}`,
          });
        }
      } else {
        if (error.status) {
          return Promise.resolve({
            status: error.status,
            message: error.message,
          });
        }
      }
    }
  }
};
