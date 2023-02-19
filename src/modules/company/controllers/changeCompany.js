import { mediaGuard } from "../../../utilities/mediaGuard.js";

export const changeCompany = async (databasePrisma, req, res) => {
  try {
    const { name, sector, logo, phone } = req.body;
    const id = req.params.id;
    // Validate to see if inputs are provided correctly
    if (!id) {
      return res.status(400).send({ error: "Company id is required" });
    }

    let data = {};
    //check is name is present and name is not already in use.
    if (name !== undefined) {
      const company = await databasePrisma.company.findUnique({
        where: { name },
      });
      if (company) {
        return res
          .status(400)
          .json({ message: "This company name already exists." });
      }
      data.name = name;
    }

    if (sector !== undefined) {
      data.sector = sector;
    }

    if (phone !== undefined) {
      data.phone = phone;
    }

    if (logo !== undefined) {
      try {
        let checkedLogo = await mediaGuard(logo);
        data.logo = checkedLogo;
      } catch (err) {
        return res
          .status(400)
          .send({ message: "Image Url is not an approved image" });
      }
    }

    try {
      const company = await databasePrisma.company.update({
        where: { id },
        data,
        include: {
          admin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });
      return res.status(200).send(company);
    } catch (err) {
      if (err.code === "P2025") {
        return res.status(409).send({ error: "Company doesn't exist" });
      }
    }
  } catch (error) {
    res.status(500).json({ ...error, message: "Internal server error" });
  }
};
