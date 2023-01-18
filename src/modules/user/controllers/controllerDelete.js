import { findUserById } from "../../../utilities/findUser.js";
import { decodeToken, verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

/**
 * validates request body, signs jwt token and returns response object
 * @param {Object} req API Request
 */

export let errorStatus = 200;

export const handleDelete = async function (req) {
  // Find the user to be updated

  const id = req.params.id;
  const user = await findUserById(id);

  //Throw 404 if user doesn't exist
  if (!user) {
    errorStatus = 401;
    return Promise.resolve({ status: 401, message: "User not found" });
  }

  //Make sure user has token and removes Bearer if need be

  const token = req.headers.authorization;
  var readyToken = token;
  if (!token) {
    errorStatus = 401;
    return Promise.resolve({
      status: 401,
      message: "User has to be authenticated to make this request",
    });
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  if (readyToken != undefined) {
    try {
      var verified = verifyToken(readyToken);
      var tokenUser = decodeToken(readyToken);
    } catch (error) {
      errorStatus = 401;
      return Promise.resolve({ status: 401, message: "Auth token not valid." });
    }
  }

  //Throw 401 error if user isn't the correct user
  if (user.role != "Admin") {
    if (verified.userId != id || tokenUser.userId != id) {
      errorStatus = 401;
      return Promise.resolve({
        status: 401,
        message: "User does not match user to be deleted.",
      });
    }
  }

  // Deletes the user
  try {
    await databasePrisma.user.delete({
      where: { id },
    });
    errorStatus = 200;
    return Promise.resolve({ status: 200, message: "Success" });
  } catch (error) {
    if (error.status) {
      return Promise.resolve({
        status: error.status,
        message: error.message,
      });
    }
  }
};
