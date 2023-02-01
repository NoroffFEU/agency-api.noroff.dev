import { databasePrisma } from "../../../prismaClient.js";

export const updateListing = async function (req, res) {
  try {
    const { id } = req.params;
    const { deadline } = req.body;

    const now = new Date().getTime();
    const newDeadline = new Date(deadline).getTime();
    const valid = now < newDeadline;

    if (!deadline) {
      res.status(400).json({ message: "deadline is required" });
    } else if (deadline !== undefined && !valid) {
      res.status(400).json({
        message: "deadline must be a future date",
      });
    }
    const listings = await databasePrisma.listing.update({
      where: {
        id: id,
      },
      data: {
        id: id,
        ...req.body,
      },
      include: { company: true },
    });

    res.status(200).json({
      data: {
        listings,
      },
      message: `Listing updated successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
