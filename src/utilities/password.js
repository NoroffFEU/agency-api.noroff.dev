import bcrypt from "bcrypt";

/**
 * Compares plain text password to hashed password
 * @param {Object} profile users profile with hashed password
 * @param {String} password plain text string provided in request
 * @returns {Promise<Boolean>} true/false
 */
export async function verifyPassword(profile, password) {
  return bcrypt.compareSync(password, profile.password);
}

/**
 * Creates a password hash, that has been sa
 * @param {String} password Plain text password
 * @returns {Object} hash
 */
 export async function generateHash(password) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

