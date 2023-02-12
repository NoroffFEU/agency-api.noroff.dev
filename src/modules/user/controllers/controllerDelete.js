import { findUserById } from "../../../utilities/findUser.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

export const handleDelete = async function (req, res) {
  try {
    // Find the user to be updated
    const id = req.params.id;

    // Deletes the user
    await databasePrisma.user.delete({
      where: { id },
    });

    return Promise.resolve({ status: 200, data: { message: "Success" } });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ ...error, message: "Internal server error" });
    }
  }
};
