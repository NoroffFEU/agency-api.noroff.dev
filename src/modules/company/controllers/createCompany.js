import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { mediaGuard } from "../../../utilities/mediaGuard.js";

export const createCompany = async (databasePrisma, req, res) => {
  const { name, sector, logo, phone, admin } = req.body;

  //Validate to see if a user is logged in
  const token = req.headers.authorization;
  let readyToken = token;

  if (!token) {
    return res.status(401).send({
      error: "User has to be authenticated to make this request",
    });
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  if (readyToken != undefined) {
    try {
      var verified = await verifyToken(readyToken);
    } catch (error) {
      return res.status(401).send({
        error: "Auth token not valid.",
      });
    }
  }

  // Validate to see if inputs are provided correctly

  if (logo) {
    try {
      let checkedLogo = await mediaGuard(logo);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: "Image Url is not an approved image" });
    }
  }

  // Validate to see i f the company name is unique
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
};

// export const createCompany = async (databasePrisma, req, res) => {
//   const { name, sector, logo, phone, admin } = req.body;

//   //Validate to see if a user is logged in

//   // Validate to see i f the companyname is unique
//   const existingCompany = await databasePrisma.company.count({
//     where: { name },
//   });
//   if (existingCompany > 0) {
//     return res.status(409).send({ error: "Company already exists" });
//   }
//   // Validate to see if inputs are provided correctly
//   if (!name || !sector || !logo || !phone || !admin) {
//     return res.status(400).send({
//       error: "You are required to provide a company name, sector, logo link, phone number, and an admin",
//     });
//   }
//   try {
//     const company = await databasePrisma.company.create({
//       data: { name, sector, logo, phone, admin: { connect: { id: admin } } },
//       include: { admin: true },
//     });

//     return res.status(201).send(company);
//   } catch (err) {
//     console.error(err);

//     return res.status(500).send({ error: "Failed to create company" });
//   }
// };
