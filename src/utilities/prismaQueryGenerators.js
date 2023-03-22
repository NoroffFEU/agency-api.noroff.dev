/**
 * Returns a prisma query object, with current page and results limit
 * @param {Object} req object
 * @returns {Object} containing query object, current page, results limit.
 * @example
 * const { prismaQuery, page, limit } = createPrismaQueryListings(req);
 */
export const createPrismaQueryListings = function (req) {
  const { sortBy, orderBy, includes, includesValue, startDate, endDate } =
    req.query;

  // Set default values for page and limit if not provided
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 100;

  // Calculate the offset for pagination
  const offset = (page - 1) * limit;

  // Build query object for Prisma
  const prismaQuery = {};
  if ((includes === "tags", includes === "requirements")) {
    // Add filtering for arrays
    if (includes && includesValue) {
      prismaQuery.where = {
        [includes]: {
          has: includesValue,
        },
      };
    }
  }

  if ((includes === "title", includes === "description")) {
    // Add filtering for strings
    if (includes && includesValue) {
      prismaQuery.where = {
        [includes]: {
          contains: includesValue,
        },
      };
    }
  }

  if (startDate || endDate) {
    prismaQuery.where = prismaQuery.where || {};
    prismaQuery.where.createdAt = {};

    if (startDate) {
      prismaQuery.where.createdAt.gte = new Date(startDate);
    }

    if (endDate) {
      prismaQuery.where.createdAt.lte = new Date(endDate);
    }
  }

  // Add sorting
  if (sortBy && orderBy) {
    prismaQuery.orderBy = {
      [sortBy]: orderBy,
    };
  }

  // Add pagination
  prismaQuery.skip = offset;
  prismaQuery.take = limit;

  return { prismaQuery, page, limit };
};
