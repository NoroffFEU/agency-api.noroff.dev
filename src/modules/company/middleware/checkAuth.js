import { databasePrisma } from "../../../prismaClient.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const verifyAccess = async (req, res, next) => {
  try {
    const user = req.user;
    const companyId = req.params.id;

    if (user.role === "Admin") {
      return next();
    }

    if (user.role === "Client" && user.companyId === companyId) {
      return next();
    }

    return res.status(401).json({
      message: "Unauthorized, you are not an admin for this company.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const validateUser = async function (req, res, next) {
  try {
    const token = req.headers.authorization;
    let readyToken = token;
    if (token === undefined) {
      return res
        .status(401)
        .json({ message: "No authorization header provided." });
    } else if (token.includes("Bearer")) {
      readyToken = token.slice(7);
    }

    let verified;
    if (readyToken !== undefined) {
      verified = await verifyToken(readyToken);
      if (!verified) {
        return res.status(401).json({
          message: "Invalid authorization token provided, please re-log.",
        });
      }
    }

    if (verified.role !== "Client" && verified.role !== "Admin") {
      return res.status(403).json({
        message: "Only Client users and Admins can manage companies.",
      });
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
    const id = req.params.id;

    if (!user.companyId && user.role !== "Admin") {
      return res
        .status(401)
        .json({ message: "You must create or join a company first." });
    }

    const company = await databasePrisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return res.status(400).json({ message: "Invalid company Id provided." });
    }

    req.company = company;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unexpected internal server error", ...error });
  }
};
