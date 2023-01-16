import jsonwebtoken from "jsonwebtoken";
import * as dotenv from "dotenv";
const { sign, decode, verify } = jsonwebtoken;

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
  const token = sign({ userId: id, email: email }, process.env.SECRETSAUCE, {
    expiresIn: "1h",
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
