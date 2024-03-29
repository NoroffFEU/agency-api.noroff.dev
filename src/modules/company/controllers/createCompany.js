import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { mediaGuard } from "../../../utilities/mediaGuard.js";

export const createCompany = async (databasePrisma, req, res) => {
  const { name, sector, logo, phone, admin } = req.body;
  const user = req.user;

  // Validate to see if inputs are provided correctly
  if (logo) {
    try {
      await mediaGuard(logo);
    } catch (err) {
      return res
        .status(400)
        .send({ message: "Image Url is not an approved image" });
    }
  }

  if (phone && (phone.length < 4 || phone.length > 15)) {
    return res
      .status(400)
      .send({ message: "Phone number must be between 4 and 15 digits" });
  }

  if (admin === undefined) {
    return res.status(400).send({ message: "No admin id provided." });
  }
  if (admin !== user.id && user.role !== "Admin") {
    return res
      .status(400)
      .send({ message: "User's Id doesn't match request admin Id." });
  }

  // Validate to see i f the company name is unique and the admin id is valid
  try {
    const company = await databasePrisma.company.create({
      data: { name, sector, logo, phone, admin: { connect: { id: admin } } },
      include: { admin: true },
    });

    return res.status(201).send(company);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).send({ message: "Company already exists." });
    } else if (err.code === "P2018") {
      return res.status(400).send({ message: "Invalid admin/user id" });
    } else {
      return res.status(500).send({ message: "Failed to create company" });
    }
  }
};
