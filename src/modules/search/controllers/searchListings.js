import { databasePrisma } from "../../../prismaClient.js";

export const searchListings = async function (req, res) {
  const {
    searchQuery,
    excludeTitle,
    excludeTags,
    excludeRequirements,
    searchIn,
    exactMatch,
  } = req.body.query;
  const lowerCaseSearchQuery = searchQuery.toLowerCase();

  let whereConditions = [];
  let excludeConditions = [];

  // conditions for search
  if (searchIn.includes("title")) {
    whereConditions.push({
      title: exactMatch
        ? { equals: lowerCaseSearchQuery }
        : { contains: lowerCaseSearchQuery, mode: "insensitive" },
    });
  }

  if (searchIn.includes("description")) {
    whereConditions.push({
      description: exactMatch
        ? { equals: lowerCaseSearchQuery }
        : { contains: lowerCaseSearchQuery, mode: "insensitive" },
    });
  }

  if (searchIn.includes("tags")) {
    whereConditions.push({
      tags: exactMatch
        ? { has: lowerCaseSearchQuery }
        : { hasSome: lowerCaseSearchQuery.split(" ") },
    });
  }

  if (searchIn.includes("requirements")) {
    whereConditions.push({
      requirements: exactMatch
        ? { has: lowerCaseSearchQuery }
        : { hasSome: lowerCaseSearchQuery.split(" ") },
    });
  }

  // Conditions for exclusions
  if (excludeTitle) {
    const processedExcludeTitle = excludeTitle.toLowerCase();
    excludeConditions.push({
      title: { contains: processedExcludeTitle, mode: "insensitive" },
    });
  }
  if (excludeTags) {
    const processedExcludeTags = excludeTags.toLowerCase().split(" ");
    excludeConditions.push({ tags: { hasSome: processedExcludeTags } });
  }
  if (excludeRequirements) {
    const processedExcludeRequirements = excludeRequirements
      .toLowerCase()
      .split(" ");
    excludeConditions.push({
      requirements: { hasSome: processedExcludeRequirements },
    });
  }

  try {
    const result = await databasePrisma.listing.findMany({
      where: {
        AND: [
          { OR: whereConditions },
          ...(excludeConditions.length > 0
            ? [{ NOT: { OR: excludeConditions } }]
            : []),
        ],
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error searching listings");
  }
};
