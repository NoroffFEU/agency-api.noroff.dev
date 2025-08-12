/**
 * Constructs a Prisma search query object based on provided search parameters,
 * inclusion and exclusion conditions.
 *
 * @param {Array} searchParams - Array of objects specifying the search fields, their types, and if an exact match is needed.
 *   Each object in the array should have the format: { key: string, type: 'string' | 'array', exactMatch: boolean }
 * @param {Object} includeConditions - Object containing the conditions for inclusion in the search.
 *   The format is { [fieldName]: string }, where fieldName is a field to be searched and the value is the search term.
 * @param {Object} excludeConditions - Object containing the conditions for exclusion from the search.
 *   Similar to includeConditions, the format is { [fieldName]: {value:string, type:"string"/"array" }}.
 *
 * @returns {Object} A Prisma query object to be used in findMany() or similar queries.
 */

export const createPrismaSearchQuery = function (
  searchParams,
  includeConditions,
  excludeConditions
) {
  let whereConditions = [];

  // Construct search conditions based on the 'searchParams' and 'includeConditions'
  searchParams.forEach((param) => {
    const { key, type, exactMatch } = param;
    const condition = includeConditions[key];

    if (condition) {
      // Check the field type and construct appropriate Prisma query conditions
      if (type === "string") {
        whereConditions.push({
          [key]: exactMatch
            ? { equals: condition }
            : { contains: condition, mode: "insensitive" },
        });
      } else if (type === "array") {
        whereConditions.push({ [key]: { hasSome: condition.split(" ") } });
      }
    }
  });

  let excludeWhereConditions = [];

  // Construct exclude conditions based on the 'excludeConditions'
  Object.keys(excludeConditions).forEach((key) => {
    const condition = excludeConditions[key];
    if (condition && condition.value) {
      if (condition.type === "string") {
        excludeWhereConditions.push({
          [key]: { contains: condition.value, mode: "insensitive" },
        });
      } else if (condition.type === "array") {
        excludeWhereConditions.push({
          [key]: { hasSome: condition.value },
        });
      }
    }
  });

  // Combine the include and exclude conditions into a single Prisma query object
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
};
