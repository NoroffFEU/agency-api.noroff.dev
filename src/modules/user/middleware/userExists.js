import { databasePrisma } from "../../../prismaClient.js";

/**
 * Middleware function that checks if listing with specified id does exist.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns "status 404" with error message if listing doesn't exist.
 */
export async function checkIfUserIdExist(req, res, next) {
  try {
    const user = await databasePrisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (user == null) {
      return res.status(404).json({ message: `User with id doesn't exist.` });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
