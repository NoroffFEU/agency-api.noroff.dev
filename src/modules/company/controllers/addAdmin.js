import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const addAdminToCompany = async (databasePrisma, req, res) => {
  const { admin } = req.body;
  const id = req.params.id;
  // Validate to see if inputs are provided correctly
  if (!id) {
    return res.status(400).send({ error: "Company id is required" });
  }
  if (!admin) {
    return res.status(400).send({ error: "Admin id is required" });
  }


  //Check if company exists
  const companyExists = await databasePrisma.company.findUnique({
    where: { id },
  });
  if (!companyExists) {
    return res.status(400).send({ message: "Company doesn't exist" });
  }

  // Check if admin id is valid
  const userExists = await databasePrisma.user.findUnique({
    where: { id: admin },
  });
  if (!userExists) {
    return res.status(400).send({ message: "Admin doesn't exist" });
  } else if (userExists.companyId === id) {
    return res
      .status(400)
      .send({ message: "User already belongs to this company" });
  } else if (userExists.role !== "Client") {
    return res
      .status(400)
      .send({ message: "User must be a client to become a company admin." });
  }

  //   Check if the user that wants to delete is the owner of the company or is an admin
  if (verified.companyId === id || verified.role === "Admin") {
    try {
      const company = await databasePrisma.company.update({
        where: { id },
        data: {
          admin: { connect: { id: admin } },
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
      return res
        .status(200)
        .send({ message: "Admin added successfully", company });
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Internal server error", error: err });
    }
  } else {
    return res.status(401).send({
      error: "User is not authorized to make this request",
    });
  }
};
