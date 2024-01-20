// schema variables to check on based on models
const listingsStrings = ["title", "description"];
const listingsArrays = ["tags", "requirements"];
const usersStrings = ["firstName", "lastName", "email"];
const usersArrays = ["skills"];
const companyStrings = ["name", "sector"];
const companyArrays = [];

/**
 * Returns a prisma query object, with current page and results limit for listings
 * @param {Object} req object
 * @param {String} endpoint which route you building for listings/users/company
 * @returns {Object} containing query object, current page, results limit.
 * @example
 * const { prismaQuery, page, limit } = createPrismaQuery(req, "listings");
 */
export const createPrismaQuery = function (req, endPoint) {
  const {
    sortBy,
    orderBy,
    includes,
    includesValue,
    startDate,
    endDate,
    expired,
  } = req.query;

  // Set default values for page and limit if not provided
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 100;

  // Calculate the offset for pagination
  const offset = (page - 1) * limit;

  // Build query object for Prisma
  const prismaQuery = {};

  // determines which values to use for includes check
  let strings;
  let arrays;
  switch (endPoint) {
    case "users":
      strings = usersStrings.includes(includes);
      arrays = usersArrays.includes(includes);
      break;
    case "company":
      strings = companyStrings.includes(includes);
      arrays = companyArrays.includes(includes);
      break;
    case "listings":
      strings = listingsStrings.includes(includes);
      arrays = listingsArrays.includes(includes);
      // filter out expired listings by default
      prismaQuery.where = prismaQuery.where || {};
      prismaQuery.where.deadline = { gte: new Date() };
      if (expired === "true") {
        delete prismaQuery.where.deadline;
      }
      break;
  }

  // check for includes key types
  if (arrays) {
    // Add filtering for arrays
    if (includes && includesValue) {
      prismaQuery.where = {
        [includes]: {
          has: includesValue,
        },
      };
    }
  } else if (strings) {
    // Add filtering for strings
    if (includes && includesValue) {
      prismaQuery.where = {
        [includes]: {
          contains: includesValue,
        },
      };
    }
  }

  // date range filters
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

  // sorting the data
  if (orderBy === "asc" || orderBy === "desc") {
    // Add sorting
    if (sortBy && orderBy) {
      prismaQuery.orderBy = {
        [sortBy]: orderBy,
      };
    }
  } else if (sortBy) {
    prismaQuery.orderBy = {
      [sortBy]: "asc",
    };
  }

  // Add pagination
  prismaQuery.skip = offset;
  prismaQuery.take = limit;

  return { prismaQuery, page, limit };
};
