import { databasePrisma } from "../../../prismaClient.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const validateUser = async function (req, res, next) {
  try {
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
    if (readyToken !== undefined) {
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

    // allow admin to create and edit company with companyId in request body
    if (verified.role === "Admin") {
      verified.companyId = req.body.companyId;
    }

    req.user = verified;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unexpected internal server error", ...error });
  }
};

export const companyExists = async function (req, res, next) {
  try {
    const user = req.user;

    if (user.role === "Admin" && user.companyId === undefined) {
      return res
        .status(401)
        .json({
          message:
            "A companyId is required in the requests, to perform this action.",
        });
    }

    if (!user.companyId || user.companyId === undefined) {
      return res
        .status(401)
        .json({ message: "You must create or join a company first." });
    }

    // check users company exists
    const company = await databasePrisma.company.findUnique({
      where: { id: user.companyId },
    });

    if (!company) {
      return res
        .status(401)
        .json({ message: "You must create or join a company first." });
    }

    req.company = company;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unexpected internal server error", ...error });
  }
};

export const verifyAccess = async function (req, res, next) {
  try {
    const user = req.user;
    const companyId = req.params.id;

    if (user.companyId !== companyId) {
      return res
        .status(404)
        .json({
          message: "Unauthorized, you are not an admin for this company.",
        });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unexpected internal server error", ...error });
  }
};
