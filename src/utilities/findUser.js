import { databasePrisma } from "../prismaClient.js";

export async function findUserByEmail(email) {
  return await databasePrisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUserById(id) {
  return await databasePrisma.user.findUnique({
    where: {
      id,
    },
  });
}
