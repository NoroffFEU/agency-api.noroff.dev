import { signToken } from "../../../utilities/jsonWebToken.js";
import { generateHash } from "../../../utilities/password.js";
import { databasePrisma } from "../../../prismaClient.js";
import { mediaGuard } from "../../../utilities/mediaGuard.js";
import validator from "express-validator";
const { validationResult } = validator;

export const handleRegister = async function (req, res) {
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
        console.log(err);
        return res.status(400).json({ message: "Bad image URL" });
      }
    }

    const result = await databasePrisma.user.create({
      data,
    });
    const { id } = result;
    result["token"] = signToken({ id, email });
    ["title", "password", "salt", "about", "createdAt", "updatedAt"].forEach(
      (field) => delete result[field]
    );
    return res.status(201).json(result);
  } catch (error) {
    // Send a 500 error if there was a problem with the insertion
    console.error(error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
};
