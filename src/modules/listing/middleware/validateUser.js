import { databasePrisma } from "../../../prismaClient.js";
import { findUserById } from "../../../utilities/findUser.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const validateUser = async function (req, res, next) {
  //get token and process
  const token = req.headers.authorization;
  let readyToken = token;
  if (token === undefined) {
    return res
      .status(401)
      .json({ message: "No authorization header provided." });
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  //verify token
  let verified;
  if (readyToken != undefined) {
    verified = await verifyToken(readyToken);

    if (!verified) {
      return res.status(401).json({
        message: "Invalid authorization token provided, please re-log.",
      });
    }
  }

  //Check user is allowed to create listings
  if (verified.role === "Applicant") {
    return res
      .status(401)
      .json({ message: "Only clients can create listings." });
  }

  // allow admin to create listings with companyId in request body
  if (verified.role === "Admin") {
    verified.companyId = req.body.companyId;
  }

  // check users company exists
  const company = databasePrisma.company.findUnique({
    where: { id: verified.companyId },
  });

  if (!company) {
    return res
      .status(401)
      .json({ message: "You must create a company first." });
  }

  next();
};
