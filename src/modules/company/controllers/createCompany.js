export const createCompany = async (databasePrisma, req, res) => {
  const { name, sector, logo, phone, admin } = req.body;

  // Validate to see if the company name is unique
  const existingCompany = await databasePrisma.company.count({ where: { name } });
  if (existingCompany > 0) {
    return res.status(409).send({ error: "Company already exists" });
  }
  // Validate to see if required fields are present
  if (!name || !sector || !logo || !phone || !admin) {
    return res.status(400).send({ error: "Missing required fields" });
  }
  try {
    const company = await databasePrisma.company.create({
      data: { name, sector, logo, phone },
    });

    return res.status(201).send(company);
  } catch (err) {
    console.error(err);

    return res.status(500).send({ error: "Failed to create company" });
  }
};
