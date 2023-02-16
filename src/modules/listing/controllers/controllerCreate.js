import { databasePrisma } from "../../../prismaClient.js";

export const createListing = async function (req, res) {
  try {
    const { title, tags, description, requirements, deadline, company } =
      req.body;
    //check all required fields have been added
    const data = { title, tags, description, requirements, deadline, company };
    let errors = [];
    [
      "title",
      "tags",
      "description",
      "requirements",
      "deadline",
      "company",
    ].forEach((key) => {
      if (data[key] === undefined) {
        errors.push(key);
      }
    });

    if (errors.length > 0) {
      return res.status(400).send({
        message: `The request body is missing the following keys; ${errors.join(
          ", "
        )}`,
      });
    }

    // check for valid date
    const now = new Date().getTime();
    const date = new Date(deadline).getTime();
    if (isNaN(date)) {
      return res
        .status(400)
        .json({ message: "Deadline must be in a valid ISO date format." });
    }
    // check for future date
    const valid = now < date;
    if (!valid) {
      return res
        .status(400)
        .json({ message: "Deadline must be a future date" });
    }

    // create the listing
    const result = await databasePrisma.listing.create({
      data: {
        ...data,
        deadline: new Date(deadline).toISOString(),
        company: { connect: { id: company } },
      },
    });

    //return the created listing
    return res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Unexpected internal server error.", ...error });
  }
};
