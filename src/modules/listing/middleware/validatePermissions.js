import { databasePrisma } from "../../../prismaClient.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

/**
 * Insert after validating user, on delete and edit endpoints to check user is an admin for the company that owns the listing.
 * @param {Object} req request data
 * @param {*} res response data to be defined
 * @param {*} next next function to move onto next function the endpoints handlers
 * @returns
 * @example
 * listingsRouter.put("/:id", validatePermissions, async (req, res) => { handleRequest(req, res)})
 */
export const validatePermissions = async function (req, res, next) {
  const listingId = req.params.id;
  const token = req.headers.authorization;

  let readyToken = token;
  if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  //verify token
  const verified = await verifyToken(readyToken);

  const listing = databasePrisma.listing.findUnique({
    where: { id: listingId },
  });

  // check the user is an admin for the company
  if (verified.companyId == !listing.companyId) {
    return res
      .status(401)
      .json({ message: "You can only edit your own company listings." });
  }

  next();
};
