import { signToken } from "../../../utilities/jsonWebToken.js";
import { verifyPassword } from "../../../utilities/password.js";
import { findUserByEmail } from "../../../utilities/findUser.js";
import validator from "express-validator";
const { body, validationResult } = validator;
/**
 * validates request body, signs jwt token and returns response object
 * @param {Object} req API Request
 * @returns {Object} returns response object to be sent to frontend
 */
export const handleLogin = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: `${errors.array()[0].msg} in ${errors.array()[0].param}${
          errors.array()[1] ? " and " + errors.array()[1].param : ""
        } field(s)`,
      });
    }

    const { email, password } = req.body;
    const profile = await findUserByEmail(email);

    // verify email exists
    if (!profile) {
      return res.status(403).json({ message: `Invalid email or password.` });
    }

    // verify password
    const correctPassword = await verifyPassword(profile, password);
    if (!correctPassword) {
      return res.status(403).json({ message: `Invalid email or password.` });
    }

    //Creating jwt token
    const token = signToken(profile);

    return res.status(200).json({
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      avatar: profile.avatar,
      token: token,
      role: profile.role,
    });
  } catch (error) {
    res.status(500).json({ ...error, message: "Internal server error." });
  }
};
