import { findUserById } from "../../../utilities/findUser.js";
import { decodeToken, verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

export const handleDelete = async function (req) {
  // Find the user to be updated
  const id = req.params.id;
  const user = await findUserById(id);

  //Throw 404 if user doesn't exist
  if (!user) {
    return Promise.resolve({
      status: 401,
      data: { message: "User not found" },
    });
  }

  //Make sure user has token and removes Bearer if need be
  const token = req.headers.authorization;
  var readyToken = token;
  if (!token) {
    return Promise.resolve({
      status: 401,
      data: { message: "User has to be authenticated to make this request" },
    });
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  if (readyToken != undefined) {
    try {
      var verified = await verifyToken(readyToken);
    } catch (error) {
      return Promise.resolve({
        status: 401,
        data: { message: "Auth token not valid." },
      });
    }
  }

  //Throw 401 error if user isn't the correct user
  if (user.role != "Admin") {
    if (verified.id != id) {
      return Promise.resolve({
        status: 401,
        data: { message: "User does not match user to be deleted." },
      });
    }
  }

  // Deletes the user
  try {
    await databasePrisma.user.delete({
      where: { id },
    });
    return Promise.resolve({ status: 200, data: { message: "Success" } });
  } catch (error) {
    if (error.status) {
      return Promise.resolve({
        status: error.status,
        data: { message: error.message },
      });
    } else {
      return Promise.resolve({
        status: 500,
        data: { message: "Internal server error.", ...error },
      });
    }
  }
};
