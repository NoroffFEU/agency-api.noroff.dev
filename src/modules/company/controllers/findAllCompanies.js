import { createPrismaQuery } from "../../../utilities/prismaQueryGenerators.js";
import { handlePrismaErrorResponse } from "../../../utilities/handlePrismaErrorResponse.js";

export const findAllCompanies = async (databasePrisma, req, res) => {
  try {
    const { prismaQuery, page, limit } = createPrismaQuery(req, "company");
    prismaQuery.include = {
      listings: true,
      admin: {
        select: {
          id: true,
          title: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          avatar: true,
          about: true,
        },
      },
    };

    const [companies, totalCount] = await Promise.all([
      databasePrisma.company.findMany(prismaQuery),
      databasePrisma.company.count(
        prismaQuery.where ? { where: prismaQuery.where } : {}
      ),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    //Set response headers
    res.set("X-Current-Page", page);
    res.set("X-Total-Pages", totalPages);

    res.status(200).send(companies);
  } catch (error) {
    handlePrismaErrorResponse(error, res);
  }
};
