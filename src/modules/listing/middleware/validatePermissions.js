import { databasePrisma } from "../../../prismaClient.js";
import { findUserById } from "../../../utilities/findUser.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const validatePermissions = async function (req, res, next) {
  const listingId = req.params.id;
  const token = req.headers.authorization;

  let readyToken = token;
  if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  //verify token
  const verified = await verifyToken(readyToken);

  const listing = databasePrisma.listing.findUserById(listingId);

  if (verified.companyId == !listing.companyId) {
    return res
      .status(401)
      .json({ message: "You can only edit your own company listings." });
  }

  next();
};
