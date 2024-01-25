import { databasePrisma } from "../../../prismaClient.js";
import { createPrismaSearchQuery } from "../../../utilities/prismaSearchQueryGenerator.js";

export const searchListings = async function (req, res) {
  try {
    // const { includeConditions, excludeConditions} = req.body;
    const exactMatch = req.body.exactMatch || false;
    const searchParams = req.body.searchParams || [];
    const excludeConditions = req.body.excludeConditions || {};
    const includeConditions = req.body.includeConditions;

    if (!includeConditions) {
      return res.status(400).send("Missing search query in includeConditions");
    }

    // Determine fields to search based on 'searchParams'
    const fieldsToSearch = searchParams.includes("all")
      ? ["title", "description", "tags", "requirements"] // list all searchable fields
      : searchParams;
    const arrayFields = ["tags", "requirements"];
    let detailedSearchParams = fieldsToSearch.map((key) => ({
      key,
      exactMatch,
      type: arrayFields.includes(key) ? "array" : "string",
    }));
    let detailedIncludeConditions = {};
    let detailedExcludeConditions = {};

    // Apply 'all' conditions if present, otherwise use specific conditions
    fieldsToSearch.forEach((field) => {
      detailedIncludeConditions[field] =
        includeConditions[field] || includeConditions.all || "";

      // Construct the exclude conditions relaying the field type for correct Prisma query construction
      const excludeCondition =
        excludeConditions[field] || excludeConditions.all || "";
      detailedExcludeConditions[field] = {
        value: excludeCondition,
        type: arrayFields.includes(field) ? "array" : "string",
      };
    });

    // Construct the query using the detailed format
    const queryObject = createPrismaSearchQuery(
      detailedSearchParams,
      detailedIncludeConditions,
      detailedExcludeConditions
    );

    const result = await databasePrisma.listing.findMany(queryObject);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error searching listings");
  }
};
