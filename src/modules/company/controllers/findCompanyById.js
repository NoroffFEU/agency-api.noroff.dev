export const findCompanyById = async (databasePrisma, req, res) => {
  try {
    const id = req.params.id;
    if (id === undefined) {
      return res.status(400).json({ message: "Bad request, company id is undefined" });
    }

    const company = await databasePrisma.company.findUnique({
      where: {
        id,
      },
      include: {
        applications: true,
        offers: true,
        listings: true,
        admin: true,
      },
    });

    if (!company) {
      return res.status(400).json({ message: "Could not find company!" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
};
