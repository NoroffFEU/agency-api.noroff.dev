import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";
import { createPrismaQuery } from "../../../utilities/prismaQueryGenerators.js";
import { Prisma } from "@prisma/client";
import { handlePrismaErrorResponse } from "../../../utilities/handlePrismaErrorResponse.js";

export const getAllListings = async function (req, res) {
  try {
    const { prismaQuery, page, limit } = createPrismaQuery(req, "listings");
    prismaQuery.include = { company: true };

    // Fetch filtered listings and total count
    const [listings, totalCount] = await Promise.all([
      databasePrisma.listing.findMany(prismaQuery),
      databasePrisma.listing.count(
        prismaQuery.where ? { where: prismaQuery.where } : {}
      ),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    //Set response headers
    res.set("X-Current-Page", page);
    res.set("X-Total-Pages", totalPages);

    // Show the listings in browser
    res.status(200).json(listings);
  } catch (error) {
    handlePrismaErrorResponse(error, res);
  }
};

export const getListingId = async function (req, res) {
  try {
    // Get id from url
    const urlID = req.params.id;

    const listing = await databasePrisma.listing.findUnique({
      where: {
        id: urlID,
      },
      include: { company: true, applications: true, offer: true },
    });

    // Check to see if array is empty
    if (listing === null) {
      res
        .status(404)
        .json({ message: `Listing with id ${urlID} doesn't exist.` });
    }

    const token = req.headers.authorization;
    const user = token !== undefined ? await verifyToken(token.slice(7)) : "";
    if (user.companyId !== listing.companyId) {
      delete listing.applications;
      delete listing.offer;
    }

    res.status(200).json(listing);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unexpected internal server error`, ...error });
  }
};
