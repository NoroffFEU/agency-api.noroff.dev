import { verifyToken } from "../../../utilities/jsonWebToken.js";

/**
 * Insert after user id check, on delete and edit endpoints to check user is verified as the own of profile.
 * @param {Object} req request data
 * @param {*} res response data to be defined
 * @param {*} next next function to move onto next function the endpoints handlers
 * @returns
 * @example
 * userRouter.put("/:id",checkIfUserExists, validateUserPermissions, handleRequest)
 */
export const validateUserPermissions = async function (req, res, next) {
  const user = req.user;
  const token = req.headers.authorization;

  let readyToken = token;
  if (token === undefined) {
    return res
      .status(401)
      .json({ message: "No authorization header provided." });
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  //verify token
  const verified = await verifyToken(readyToken);
  if (!verified) {
    return res.status(401).json({
      message: "Invalid authorization token provided, please re-log.",
    });
  }

  if (verified.id !== user.id && verified.role !== "Admin") {
    return res
      .status(401)
      .json({ message: "You can not edit another users profile." });
  }

  next();
};
