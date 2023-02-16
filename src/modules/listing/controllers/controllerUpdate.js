import { databasePrisma } from "../../../prismaClient.js";

export const updateListing = async function (req, res) {
  try {
    const { id } = req.params;
    const { title, tags, description, requirements, deadline, company } =
      req.body;
    //check all required fields have been added
    const data = { title, tags, description, requirements, deadline };
    let errors = [];
    ["title", "tags", "description", "requirements", "deadline"].forEach(
      (key) => {
        if (data[key] === undefined) {
          delete data[key];
        }
      }
    );

    // check for valid date
    if (deadline !== undefined) {
      const now = new Date().getTime();
      const date = new Date(deadline).getTime();
      if (isNaN(date)) {
        return res
          .status(400)
          .json({ message: "Deadline must be in a valid ISO date format." });
      }
      // check for future date
      const valid = now < date;
      if (!valid) {
        return res
          .status(400)
          .json({ message: "Deadline must be a future date." });
      }

      if (!deadline) {
        res.status(400).json({ message: "deadline is required" });
      } else if (deadline !== undefined && !valid) {
        res.status(400).json({
          message: "deadline must be a future date",
        });
      }
      data.deadline = new Date(deadline).toISOString();
    }

    const listings = await databasePrisma.listing.update({
      where: {
        id: id,
      },
      data,
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
