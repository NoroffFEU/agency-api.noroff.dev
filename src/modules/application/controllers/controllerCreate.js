import { databasePrisma } from "../../../prismaClient.js";

export const handleCreate = async function (req, res) {
  const data = req.body;
  try {
    const result = await databasePrisma.application.create({
      data: data,
    });

    return result;
  } catch (error) {
    if (error.code === "P2002") {
      return Promise.resolve({
        status: 409,
        message: `You've already created an application on this listing`,
      });
    } else if (error.status) {
      return Promise.resolve({
        status: error.status,
        message: error.message,
      });
    }

    console.log(error);
  }
};
