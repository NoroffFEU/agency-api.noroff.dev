import { databasePrisma } from "../prismaClient.js";

/**
 * Finds and returns a user based on email
 * @param {String} email
 * @returns {Object} user data
 */
export async function findUserByEmail(email) {
  return await databasePrisma.user.findUnique({
    where: {
      email,
    },
  });
}

/**
 * Finds and returns a user based on id
 * @param {String} id
 * @returns {Object} user data
 */
export async function findUserById(id) {
  return await databasePrisma.user.findUnique({
    where: {
      id,
    },
  });
}
