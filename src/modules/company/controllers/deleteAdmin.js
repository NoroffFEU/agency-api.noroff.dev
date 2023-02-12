import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const deleteAdminFromCompany = async (databasePrisma, req, res) => {
  const { admin } = req.body;
  const id = req.params.id;
  // Validate to see if inputs are provided correctly
  if (!id) {
    return res.status(400).send({ error: "Company id is required" });
  }
  if (!admin) {
    return res.status(400).send({ error: "Admin id is required" });
  }
  //Validate to see if a user is logged in
  const token = req.headers.authorization;
  let JWT = token;
  if (!token) {
    return res.status(401).send({
      error: "User has to be authenticated to make this request",
    });
  } else if (token.includes("Bearer")) {
    JWT = token.slice(7);
  }
  if (JWT === undefined) {
    return res.status(401).send({
      message: "No authorization header provided.",
    });
  }
  var verified = await verifyToken(JWT);
  if (!verified) {
    return res.status(401).send({
      message: "Authorization token is not valid.",
    });
  }

  //Check if company exists
  const companyExists = await databasePrisma.company.findUnique({
    where: { id },
  });
  if (!companyExists) {
    return res.status(400).send({ error: "Company doesn't exist" });
  }

  // Check if admin id is valid
  const userExists = await databasePrisma.user.findUnique({
    where: { id: admin },
  });
  if (!userExists) {
    return res.status(400).send({ error: "User doesn't exist" });
  } else if (userExists.companyId !== id) {
    return res.status(400).send({ error: "User doesn't belong to this company" });
  }

  //   Check if the user that wants to delete is the owner of the company or is an admin
  if (verified.companyId === id || verified.role === "Admin") {
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
      //   return res.status(200).send({ message: "Admin deleted successfully" });
      return res.status(200).send({ message: "Admin deleted successfully", company });
    } catch (err) {
      if (err) {
        return res.status(409).send({ message: "Bad request", error: err });
      }
    }
  } else {
    return res.status(401).send({
      error: "User is not authorized to delete an admin",
    });
  }
};
