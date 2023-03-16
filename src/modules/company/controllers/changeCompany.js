import { mediaGuard } from "../../../utilities/mediaGuard.js";
import validator from "express-validator";
const { body, validationResult } = validator;

export const changeCompany = async (databasePrisma, req, res) => {
  try {
    const { name, sector, logo, phone, email, locations, about, website } =
      req.body;
    const id = req.params.id;
    const data = {
      name,
      sector,
      logo,
      phone,
      email,
      locations,
      about,
      website,
    };

    // Get the express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Bad value in body", errors: errors.array() });
    }

    if (logo !== undefined) {
      try {
        await mediaGuard(logo);
      } catch (err) {
        return res
          .status(400)
          .send({ message: "Image Url is not an approved image" });
      }
    }

    [
      "name",
      "sector",
      "logo",
      "phone",
      "email",
      "locations",
      "about",
      "website",
    ].forEach((field) => (data[field] === undefined ? delete data[field] : ""));

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
