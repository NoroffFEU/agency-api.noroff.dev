import jsonwebtoken from "jsonwebtoken";
import * as dotenv from "dotenv";
const { sign, decode, verify } = jsonwebtoken;
import { databasePrisma } from "../prismaClient";

/**
 * Takes a token and verifies it
 * @param {String} token
 * @returns {Boolean}
 */
export function verifyToken(token) {
  return verify(token, process.env.SECRETSAUCE);
}

/**
 * Create a token
 * @param {Object} profile needs userId and email
 * @returns
 */
export function signToken({ id, email }) {
  const token = sign({ userId: id, email: email }, process.env.SECRETSAUCE, { expiresIn: "1h" });
  return token;
}
