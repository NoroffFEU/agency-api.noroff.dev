import { databasePrisma } from "../../../prismaClient.js";

export const deleteAdminFromCompany = async (req, res) => {
  const { admin } = req.body;
  const id = req.params.id;

  // Validate to see if inputs are provided correctly
  if (!id) {
    return res.status(400).send({ message: "Company id is required" });
  }
  if (!admin) {
    return res.status(400).send({ message: "Admin id is required" });
  }

  // Check if company exists
  const companyExists = await databasePrisma.company.findUnique({
    where: { id },
    include: { admin: true },
  });

  if (!companyExists) {
    return res.status(400).send({ message: "Company doesn't exist" });
  }

  // Check if admin id is valid
  const userExists = await databasePrisma.user.findUnique({
    where: { id: admin },
  });

  if (!userExists) {
    return res.status(400).send({ message: "User doesn't exist" });
  } else if (userExists.companyId !== id) {
    return res.status(400).send({ message: "User doesn't belong to this company" });
  }

  if (companyExists.admin.length === 1) {
    return res.status(400).send({ message: "A company requires at least 1 admin." });
  }

  // Check if the user that wants to delete is the owner of the company or is an admin
  if (req.user.companyId === id || req.user.role === "Admin") {
    try {
      const company = await databasePrisma.company.update({
        where: { id },
        data: {
          admin: { disconnect: { id: admin } },
        },
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
      return res.status(200).send({ message: "Admin deleted successfully", company });
    } catch (err) {
      return res.status(409).send({ message: "Bad request", error: err });
    }
  } else {
    return res.status(401).send({
      message: "User is not authorized to delete an admin",
    });
  }
};
