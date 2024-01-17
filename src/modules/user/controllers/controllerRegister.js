import { generateHash } from "../../../utilities/password.js";
import { databasePrisma } from "../../../prismaClient.js";
import { mediaGuard } from "../../../utilities/mediaGuard.js";
import validator from "express-validator";
const { validationResult } = validator;

export const handleRegister = async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: `${errors.array()[0].msg} in ${errors.array()[0].param}${
          errors.array()[1] ? " and " + errors.array()[1].param : ""
        } field(s)`,
      });
    }

    const { firstName, lastName, email, password, role, avatar } = req.body;
    if (firstName === undefined) {
      return res
        .status(400)
        .json({ message: "Missing required field, firstName." });
    }
    if (lastName === undefined) {
      return res
        .status(400)
        .json({ message: "Missing required field, lastName." });
    }

    // Check if user exists
    const existingUser = await databasePrisma.user.count({ where: { email } });
    if (existingUser > 0) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hash = await generateHash(password);
    // create object
    let data = {
      firstName,
      lastName,
      email,
      password: hash,
    };
    // if client
    if (role === "Client") {
      data.role = role;
    }
    // if avatar
    if (avatar) {
      try {
        data.avatar = await mediaGuard(avatar);
      } catch (err) {
        return res.status(400).json({ message: "Bad image URL" });
      }
    }

    const user = await databasePrisma.user.create({
      data,
    });

    next();
  } catch (error) {
    // Send a 500 error if there was a problem with the insertion
    return res.status(500).json({ ...error, message: "Internal server error" });
  }
};
