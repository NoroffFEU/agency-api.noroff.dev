import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const deleteCompany = async (databasePrisma, req, res) => {
  const { id } = req.body;
  // Validate to see if inputs are provided correctly
  if (!id) {
    return res.status(400).send({ error: "Company id is required" });
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
      message: "Authorization token not valid.",
    });
  }

  //   Check if the user that wants to delete is the owner of the company or is an admin
  if (verified.companyId === id || verified.role === "Admin") {
    try {
      const company = await databasePrisma.company.delete({
        where: { id },
      });
      return res.status(200).send(company);
    } catch (err) {
      if (err.code === "P2025") {
        return res.status(409).send({ error: "Company doesn't exist" });
      }
    }
  } else {
    return res.status(401).send({
      error: "User is not authorized to make this request",
    });
  }
};
