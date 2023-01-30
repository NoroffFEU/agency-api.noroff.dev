import { signToken } from "../../../utilities/jsonWebToken.js";
import { generateHash } from "../../../utilities/password.js";
import { databasePrisma } from "../../../prismaClient.js";
import { mediaGuard } from "../../../utilities/mediaGuard.js";

export const createListing = async function (req, res) {
  const { title, tags, description, requirements, deadline, company } =
    req.body;

  const now = new Date().getTime();
  const valid = now < new Date(deadline).getTime();

  if (!valid) {
    return res
      .status(400)
      .json({ message: "Deadline must be greater than todays date" });
  } else if (
    title &&
    tags &&
    description &&
    requirements &&
    deadline &&
    company
  ) {
    const result = await databasePrisma.listing.create({
      data: {
        title: title,
        tags: tags,
        description: description,
        requirements: requirements,
        deadline: deadline,
        company: { connect: { id: company } },
      },
    });

    return res.status(201).json(result);
  } else {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields" });
  }
};
