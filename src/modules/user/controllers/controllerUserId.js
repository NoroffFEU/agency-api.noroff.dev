import { createThrownError } from "../../utilities/errorMessages.js";
import { databasePrisma } from "../../prismaClient.js";

export const handleUserId = async function (req) {
  const id = req.params.id;
  const user = await databasePrisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw createThrownError(404, "Could not find user!");
  }

  if (id === undefined) {
    throw createThrownError(400, "Bad request, user id is undefined");
  }
};
