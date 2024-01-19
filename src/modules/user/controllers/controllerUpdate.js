import { generateHash, verifyPassword } from "../../../utilities/password.js";
import { databasePrisma } from "../../../prismaClient.js";
import { mediaGuard } from "../../../utilities/mediaGuard.js";

/**
 * validates request body and returns response object
 * @param {Object} req API Request
 */
export const handleUpdate = async function (req, res) {
  try {
    // Find the user to be updated
    const id = req.params.id;
    const user = req.user;

    const {
      email,
      title,
      firstName,
      lastName,
      password,
      about,
      avatar,
      skills,
      currentpassword,
      role,
    } = req.body;

    let details = {};
    //if user is a applicant or client don't allow an update of role
    if (user.role === "Admin") {
      details.role = role;
    } else if (role !== undefined) {
      return res
        .status(401)
        .json({ message: "You don't have permission to edit roles." });
    }

    if (title !== undefined) {
      details.title = title;
    }

    if (firstName !== undefined) {
      details.firstName = firstName;
    }

    if (lastName !== undefined) {
      details.lastName = lastName;
    }

    if (about !== undefined) {
      details.about = about;
    }

    // Handles password changes
    if (password !== undefined && currentpassword !== undefined) {
      if (password.length >= 5 && password.length <= 20) {
        if (await verifyPassword(user, currentpassword)) {
          const hash = await generateHash(password);
          details.password = hash;
        } else {
          return res.status(401).json({ message: "Incorrect Password." });
        }
      } else {
        return res.status(400).json({
          message:
            "Password does not meet required parameters length: min 5, max 20.",
        });
      }
    } else if (password !== undefined && currentpassword === undefined) {
      return res.status(401).json({ message: "No current password provided." });
    }

    if (email !== undefined) {
      // Is the email already registered to an account.
      const isEmailInUse = await databasePrisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!isEmailInUse) {
        return res.status(403).json({
          message: "Email is already in use.",
        });
      }

      //Email update request meets email parameters
      const emailReg = /^\S+@\S+\.\S+$/;
      if (!emailReg.test(email)) {
        return res.status(403).json({
          message: "Email provided does not meet email format requirements",
        });
      } else if (email !== undefined) {
        details.email = email;
      }
    }

    if (avatar !== undefined) {
      try {
        await mediaGuard(avatar);
        details.avatar = avatar;
      } catch (err) {
        return res.status(400).json({ message: "Bad image URL" });
      }
    }

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        details.skills = skills;
      } else {
        return res.status(400).json({ message: "skills must be an array." });
      }
    }

    // Updates the user
    try {
      const result = await databasePrisma.user.update({
        where: { id },
        data: details,
      });

      result.response = "User details updated successfully.";
      delete result.password;
      delete result.salt;
      return res.status(200).json(result);
    } catch (error) {
      if (!error.status) {
        // Checks for database related errors
        if (error.meta != undefined) {
          return res.status(409).json({
            message: `The unique input ${error.meta.target[0]} already exists for another user`,
          });
        } else {
          return res.status(400).json({
            message: `An argument or input value does not exist or cannot be edited in the database ${error.message}`,
          });
        }
      } else {
        if (error.status) {
          return res.status(error.status).json({ message: error.message });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ ...error, message: "Internal server error" });
  }
};
