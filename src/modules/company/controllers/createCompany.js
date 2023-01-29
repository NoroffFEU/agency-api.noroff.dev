import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { mediaGuard } from "../../../utilities/mediaGuard.js";

export const createCompany = async (databasePrisma, req, res) => {
  const { name, sector, logo, phone, admin } = req.body;

  // Validate to see if inputs are provided correctly
  if (logo) {
    try {
      let checkedLogo = await mediaGuard(logo);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: "Image Url is not an approved image" });
    }
  }

  if (phone && (phone.length < 4 || phone.length > 15)) {
    return res.status(400).send({ error: "Phone number must be between 4 and 15 digits" });
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

  // Check if the creator of the company is a client or admin
  if (verified.role === "Admin" || verified.role === "Client") {
    // Validate to see i f the company name is unique and the admin id is valid
    try {
      const company = await databasePrisma.company.create({
        data: { name, sector, logo, phone, admin: { connect: { id: admin } } },
        include: { admin: true },
      });

      return res.status(201).send(company);
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(409).send({ error: "Company already exists" });
      } else if (err.code === "P2018") {
        return res.status(400).send({ error: "Invalid admin/user id" });
      } else {
        return res.status(500).send({ error: "Failed to create company" });
      }
    }
  } else {
    return res.status(401).send({
      error: "User has to be a client to make this request",
    });
  }
};
