import { databasePrisma } from "../../../prismaClient.js";

export const deleteListing = async function (req, res) {
  try {
    await databasePrisma.listing.delete({
      where: {
        id: req.params.id,
      },
    });
    res
      .status(200)
      .json({ message: `Listing with id: ${req.params.id} was deleted.` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Unexpected internal server error", ...err });
  }
};
