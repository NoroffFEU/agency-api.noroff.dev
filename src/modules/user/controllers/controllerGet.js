import { databasePrisma } from "../../../prismaClient.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const getAllUsers = async function (req, res) {
  let sort = req.query.sort;
  let order = req.query.order;
  if (order !== "asc" && order !== "desc") {
    order = undefined;
  }

  const validValue = [
    "firstName",
    "lastName",
    "companyId",
    "created",
    "updated",
  ].filter((sortValue) => sortValue === sort);

  if (validValue.length === 0) {
    sort = undefined;
  }

  if (sort === undefined || order === undefined) {
    sort = "firstName";
    order = "asc";
  }

  try {
    const users = await databasePrisma.user.findMany({
      include: {
        company: true,
      },
      orderBy: [{ [sort]: order }],
    });

    users.forEach((user) => {
      delete user.password;
      delete user.salt;
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ ...error, message: "Internal server error" });
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
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
};
