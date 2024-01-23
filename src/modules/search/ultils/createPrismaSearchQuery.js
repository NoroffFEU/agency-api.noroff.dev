export default function createPrismaSearchQuery(
  searchParams,
  includeConditions,
  excludeConditions
) {
  let whereConditions = [];

  // Construct search conditions
  searchParams.forEach((param) => {
    const { key, type, exactMatch } = param;
    const condition = includeConditions[key];

    if (condition) {
      if (type === "string") {
        whereConditions.push({
          [key]: exactMatch
            ? { equals: condition, mode: "insensitive" }
            : { contains: condition, mode: "insensitive" },
        });
      } else if (type === "array") {
        whereConditions.push({ [key]: { hasSome: condition.split(" ") } });
      }
    }
  });

  let excludeWhereConditions = [];

  excludeConditions.forEach((param) => {
    const { key, type } = param;
    const condition = includeConditions[key];

    if (condition) {
      if (type === "string") {
        excludeWhereConditions.push({
          [key]: { contains: condition, mode: "insensitive" },
        });
      } else if (type === "array") {
        excludeWhereConditions.push({
          [key]: { hasSome: condition.split(" ") },
        });
      }
    }
  });

  return {
    where: {
      AND: [
        { OR: whereConditions },
        ...(excludeWhereConditions.length > 0
          ? [{ NOT: { OR: excludeWhereConditions } }]
          : []),
      ],
    },
  };
}
