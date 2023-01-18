import { signToken } from "../../../utilities/jsonWebToken.js";
import { verifyPassword } from "../../../utilities/password.js";
import { findUserByEmail } from "../../../utilities/findUser.js";

/**
 * validates request body, signs jwt token and returns response object
 * @param {Object} req API Request
 * @returns {Object} returns response object to be sent to frontend
 */
export const handleLogin = async function (req) {
  const { email, password } = req.body;
  const profile = await findUserByEmail(email);

  // verify email exists
  if (!profile) {
    return { status: 403, data: { message: `Invalid email or password.` } };
  }

  // verify password
  const correctPassword = await verifyPassword(profile, password);
  if (!correctPassword) {
    return { status: 403, data: { message: `Invalid email or password.` } };
  }

  //Creating jwt token
  const token = signToken(profile);

  return {
    status: 200,
    data: {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      avatar: profile.avatar,
      token: token,
      role: profile.role,
    },
  };
};
