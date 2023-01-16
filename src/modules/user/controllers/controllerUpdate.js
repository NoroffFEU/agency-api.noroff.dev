import { generateHash, verifyPassword } from "../../../utilities/password.js";
import { findUserById } from "../../../utilities/findUser.js";
import { decodeToken, verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

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
    return Promise.resolve({ status: 401, message: "User not found" });
  }
  //Make sure user has token and removes Bearer if need be
  const token = req.headers.authorization;
  var readyToken = token;
  if (!token) {
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
      return Promise.resolve({ status: 401, message: "Auth token not valid." });
    }
  }
  //Throw 401 error if user isn't the correct user
  if (verified.userId != id || tokenUser.userId != id) {
    return Promise.resolve({
      status: 401,
      message: "User does not match user to be edited",
    });
  } else {
    // removes id from body stopping user from updating it
    let idMsg = "User details updated successfully.";
    if ("id" in req.body == true) {
      delete req.body.id;
      idMsg = "An ID was found in the body and was removed pre update.";
    }

    // Handles password changes
    if (
      "password" in req.body == true &&
      req.body.currentpassword != undefined
    ) {
      if (req.body.password.length >= 5 && req.body.password.length <= 20) {
        if ((await verifyPassword(user, req.body.currentpassword)) == true) {
          delete req.body.currentpassword;
          const hash = await generateHash(req.body.password);
          req.body.password = hash;
        } else {
          return Promise.resolve({
            status: 401,
            message: "Incorrect Password",
          });
        }
      } else {
        return Promise.resolve({
          status: 401,
          message:
            "Password does not meet required parameters length: min 5, max 20",
        });
      }
    } else if (
      "password" in req.body == true &&
      req.body.currentpassword == undefined
    ) {
      return Promise.resolve({
        status: 401,
        message: "No current password provided",
      });
    }

    // Email update request meets email parameters
    const emailReg = /^\S+@\S+\.\S+$/;
    if ("email" in req.body == true && emailReg.test(req.body.email) == false) {
      return Promise.resolve({
        status: 403,
        message: "Email provided does not meet email format requirements",
      });
    }

    // Updates the user
    try {
      const result = await databasePrisma.user.update({
        where: { id },
        data: req.body,
      });
      result.response = idMsg;
      delete result.password;
      delete result.salt;
      return result;
    } catch (error) {
      if (!error.status) {
        // Checks for database related errors
        if (error.meta != undefined) {
          return Promise.resolve({
            status: 409,
            message:
              "The unique input ${error.meta.target[0]} already exists for another user",
          });
        } else {
          return Promise.resolve({
            status: 400,
            message: `An argument or input value does not exist or cannot be edited in the database ${error.message}`,
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
