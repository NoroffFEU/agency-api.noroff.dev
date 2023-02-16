import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";

export const getAllListings = async function (req, res) {
  try {
    // Get listings from database
    const listings = await databasePrisma.listing.findMany({
      include: { company: true },
    });

    // Show the listings in browser
    res.status(200).json(listings);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal server error`, statusCode: "500" });
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
    console.log(error);
    res
      .status(500)
      .json({ message: `Unexpected internal server error`, ...error });
  }
};
