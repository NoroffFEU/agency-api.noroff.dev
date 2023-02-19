import { databasePrisma } from "../../../prismaClient.js";

export const handleDelete = async function (req, res) {
  try {
    // Find the user to be updated
    const id = req.params.id;

    // Deletes the user
    await databasePrisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ message: "User successfully deleted." });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    } else {
      return res
        .status(500)
        .json({ ...error, message: "Internal server error" });
    }
  }
};
