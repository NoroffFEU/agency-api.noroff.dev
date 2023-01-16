import { verifyToken } from "../../../utilities/jsonWebToken.js";

import { createThrownError } from "../../../utilities/errorMessages.js";
import { databasePrisma } from "../../../prismaClient.js";

export const handleUpdate = async function (req) {
  const { applicant, listing, coverLetter } = req.body;

  //Make sure user has token and removes Bearer if need be
  const token = req.headers.authorization;
  // Get token if there is one
  let readyToken = token;
  if (!token) {
    throw createThrownError(
      401,
      `User has to be authenticated to make this request`
    );
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  // Verify the token in order to authenticate the request
  let verified;

  if (readyToken !== undefined) {
    try {
      verified = verifyToken(readyToken);
    } catch (error) {
      throw createThrownError(401, `Auth token not valid.`);
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
          throw createThrownError(
            409,
            `You've already created an application on this listing`
          );
        } else {
          throw createThrownError(400, `${error.message}`);
        }
      } else {
        if (error.status) {
          throw createThrownError(error.status, error.message);
        }
      }
    }
  }
};
