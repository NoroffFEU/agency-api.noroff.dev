import { generateHash, verifyPassword } from "../../../utilities/password.js";
import { findUserById } from "../../../utilities/findUser.js";
import {
  decodeToken,
  signToken,
  verifyToken,
} from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";
import { createThrownError } from "../../../utilities/errorMessages.js";

/**
 * validates request body, signs jwt token and returns response object
 * @param {Object} req API Request
 */
export const handleUpdate = async function (req) {
  // Find the user to be updated
  const id = req.params.id;
  const user = await findUserById(id);

  //Throw 404 if user doesn't exist
  if (!user) {
    throw createThrownError(404, `User not found`);
  }
  //Make sure user has token and removes Bearer if need be
  const token = req.headers.authorization;
  var readyToken = token;
  if (!token) {
    throw createThrownError(
      401,
      `User has to be authenticated to make this request`
    );
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  if (readyToken != undefined) {
    try {
      var verified = verifyToken(readyToken);
      var tokenUser = decodeToken(readyToken);
    } catch (error) {
      throw createThrownError(401, `Auth token not valid.`);
    }
  }
  //Throw 401 error if user isn't the correct user
  if (verified.userId != id || tokenUser.userId != id) {
    throw createThrownError(401, `User does not match user to be edited`);
  } else {
    // removes id from body stopping user from updating it
    let idMsg = "User details updated successfully.";
    if ("id" in req.body == true) {
      delete req.body.id;
      idMsg = "An ID was found in the body and was removed pre update.";
    }

    // Handles password changes
    if ("password" in req.body == true) {
      if ((await verifyPassword(user, req.body.oldpassword)) == true) {
        delete req.body.oldpassword;
        const hash = await generateHash(req.body.password);
        req.body.password = hash;
      } else {
        throw createThrownError(401, `Incorrect Password`);
      }
    }

    // Updates the user
    try {
      const result = await databasePrisma.user.update({
        where: { id },
        data: req.body,
      });
      result.response = idMsg;
      return result;
    } catch (error) {
      if (!error.status) {
        // Checks for database related errors
        if (error.meta != undefined) {
          throw createThrownError(
            409,
            `The unique input ${error.meta.target[0]} already exists for another user`
          );
        } else {
          throw createThrownError(
            400,
            `An argument or input value does not exist or cannot be edited in the database ${error.message}`
          );
        }
      } else {
        if (error.status) {
          throw createThrownError(error.status, error.message);
        }
      }
    }
  }
};
