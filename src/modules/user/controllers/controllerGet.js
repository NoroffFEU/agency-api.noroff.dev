import { databasePrisma } from "../../../prismaClient.js";

export const getAllUsers = async function (req, res) {
  try {
    const users = await databasePrisma.user.findMany({
      include: {
        company: true,
      },
    });

    users.forEach((user) => {
      delete user.password;
      delete user.salt;
    });

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
};

export const getAUser = async function (req, res) {
  try {
    const id = req.params.id;
    const user = await databasePrisma.user.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
};
