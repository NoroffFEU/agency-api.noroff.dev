import { databasePrisma } from "../../../prismaClient.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { createPrismaQuery } from "../../../utilities/prismaQueryGenerators.js";
import { handlePrismaErrorResponse } from "../../../utilities/handlePrismaErrorResponse.js";

export const getAllUsers = async function (req, res) {
  try {
    const { prismaQuery, page, limit } = createPrismaQuery(req, "users");
    prismaQuery.include = {
      company: true,
    };

    const [users, totalCount] = await Promise.all([
      databasePrisma.user.findMany(prismaQuery),
      databasePrisma.user.count(
        prismaQuery.where ? { where: prismaQuery.where } : {}
      ),
    ]);
    users.forEach((user) => {
      delete user.password;
      delete user.salt;
    });
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    //Set response headers
    res.set("X-Current-Page", page);
    res.set("X-Total-Pages", totalPages);

    res.status(200).json(users);
  } catch (error) {
    handlePrismaErrorResponse(error, res);
  }
};

export const getAUser = async function (req, res) {
  try {
    const id = req.params.id;
    //check if it is users profile, returns offers and application data if true
    let verified = false;
    const token = req.headers.authorization;
    let readyToken = token;
    if (token !== undefined) {
      if (token.includes("Bearer")) {
        readyToken = token.slice(7);
      }

      //verify token
      const verification = await verifyToken(readyToken);
      if (verification.id === id) {
        verified = true;
      }
    }

    const user = await databasePrisma.user.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
        offers: verified,
        applications: verified,
      },
    });

    ["password", "salt"].forEach((field) => delete user[field]);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ ...error, message: "Internal server error" });
  }
};
