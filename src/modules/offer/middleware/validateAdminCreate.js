import { databasePrisma } from "../../../prismaClient.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const validateAdminCreate = async function (req, res, next) {
  try {
    // get token and process
    const token = req.headers.authorization;
    let readyToken = token;
    if (token === undefined) {
      return res
        .status(401)
        .json({ message: "No authorization header provided." });
    } else if (token.includes("Bearer")) {
      readyToken = token.slice(7);
    }

    // verify token
    let verified;
    if (readyToken !== undefined) {
      verified = await verifyToken(readyToken);
      if (!verified) {
        return res.status(401).json({
          message: "Invalid authorization token provided, please re-log.",
        });
      }
    }

    // return user
    req.user = verified;

    // get the application
    const id = req.body.applicationId;
    const application = await databasePrisma.application.findUnique({
      where: {
        id,
      },
    });

    // check that the application exists
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // check if users companyId matches the applications companyId
    if (application.companyId !== req.user.companyId) {
      return res.status(401).json({
        message:
          "Only the company that created the application can create an offer.",
      });
    }

    // if all is good proceed to the controller function to process request
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unexpected internal server error", ...error });
  }
};
