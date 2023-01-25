import jsonwebtoken from "jsonwebtoken";
import * as dotenv from "dotenv";
const { sign, decode, verify } = jsonwebtoken;
import { findUserById } from "./findUser.js";

/**
 * Takes a token and verifies it, as well as verify user still exists returns false or user data
 * @param {String} token
 * @returns {promise<Boolean||Object>}
 */
export async function verifyToken(token) {
  try {
    const data = verify(token, process.env.SECRETSAUCE);
    if (data) {
      const user = await findUserById(data.userId);
      if (user) {
        return Promise.resolve(user);
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Creates an access token
 * @param {Object} profile needs userId and email
 * @returns {String} access token
 */
export function signToken({ id, email }) {
  const token = sign({ userId: id, email: email }, process.env.SECRETSAUCE, {
    expiresIn: "24h",
  });
  return token;
}

/**
 * Decodes information from a access token
 * @param {String} token needs to be a string and not include Bearer at beginning
 * @returns {Object} user and token details
 */
export function decodeToken(token) {
  const data = decode(token);
  return data;
}
