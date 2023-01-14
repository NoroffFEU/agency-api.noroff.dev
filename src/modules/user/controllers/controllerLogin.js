import { signToken } from "../../../utilities/jsonWebToken.js";
import { verifyPassword } from "../../../utilities/password.js";
import { findUserByEmail } from "../../../utilities/findUser.js";
import { createThrownError } from "../../../utilities/errorMessages.js";

/**
 * validates request body, signs jwt token and returns response object
 * @param {Object} req API Request
 * @returns {Object} returns response object to be sent to frontend
 */
export const handleLogin = async function (req) {
  const { email, password } = req.body;
  if (!password || !email) {
    throw createThrownError(
      400,
      `Bad request: request body missing${!password ? " password" : ""}${
        !password && !email ? " and" : ""
      }${!email ? " email" : ""}.`
    );
  }

  const profile = await findUserByEmail(email);

  //could return email doesn't exist here?
  if (!profile) {
    throw createThrownError(403, `Invalid email or password.`);
  }

  const correctPassword = await verifyPassword(profile, password);
  console.log(correctPassword);

  if (!correctPassword) {
    throw createThrownError(403, `Invalid email or password.`);
  }

  let token;
  //Creating jwt token
  token = signToken(profile);

  return {
    ok: true,
    data: {
      userId: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      password: profile.password,
      token: token,
    },
  };
};
