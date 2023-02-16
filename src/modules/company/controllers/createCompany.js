import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const createCompany = async (databasePrisma, req, res) => {
  const { name, sector, logo, phone, admin } = req.body;

  //Validate to see if a user is logged in

  // Validate to see if the company name is unique
  const existingCompany = await databasePrisma.company.count({
    where: { name },
  });
  if (existingCompany > 0) {
    return res.status(409).send({ error: "Company already exists" });
  }
  // Validate to see if inputs are provided correctly
  if (!name || !sector || !logo || !phone || !admin) {
    return res
      .status(400)
      .send({
        error:
          "You are required to provide a company name, sector, logo link, phone number, and an admin",
      });
  }
  try {
    const company = await databasePrisma.company.create({
      data: { name, sector, logo, phone, admin: { connect: { id: admin } } },
      include: { admin: true },
    });

    return res.status(201).send(company);
  } catch (err) {
    console.error(err);

    return res.status(500).send({ error: "Failed to create company" });
  }
};
