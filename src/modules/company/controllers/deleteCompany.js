export const deleteCompany = async (databasePrisma, req, res) => {
  const id = req.params.id;
  // Validate to see if inputs are provided correctly
  if (id === undefined) {
    return res.status(400).send({ message: "Company id is required" });
  }

  try {
    const company = await databasePrisma.company.delete({
      where: { id },
    });
    return res.status(200).send(company);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(409).send({ message: "Company doesn't exist" });
    }
  }
};
