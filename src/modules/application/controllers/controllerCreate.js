import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

export const handleUpdate = async function (req) {
  const { applicant, listing, coverLetter } = req.body;

  //Make sure user has token and removes Bearer if need be
  const token = req.headers.authorization;
  // Get token if there is one
  let readyToken = token;
  if (!token) {
    return Promise.resolve({
      status: 401,
      message: "User has to be authenticated to make this request",
    });
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  // Verify the token in order to authenticate the request
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
      const result = await databasePrisma.application.create({
        data: {
          applicant,
          listing,
          coverLetter,
        },
      });

      return result;
    } catch (error) {
      if (!error.status) {
        // Checks for database related errors
        if (error.meta !== undefined) {
          return Promise.resolve({
            status: 409,
            message: `You've already created an application on this listing`,
          });
        } else {
          return Promise.resolve({ status: 409, message: `${error.message}` });
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
