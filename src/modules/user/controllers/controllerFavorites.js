import { databasePrisma } from "../../../prismaClient.js";

export const toggleFavorite = async function (req, res) {
  try {
    const { listingId } = req.body;
    const userId = req.user.id;

    if (!listingId) {
      return res.status(400).json({
        message: "Listing ID is required",
      });
    }

    const listing = await databasePrisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    const existingFavorite = await databasePrisma.favoriteListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (existingFavorite) {
      await databasePrisma.favoriteListing.delete({
        where: {
          userId_listingId: {
            userId,
            listingId,
          },
        },
      });

      res.status(200).json({
        action: "removed",
        message: "Favorite removed successfully",
      });
    } else {
      const favorite = await databasePrisma.favoriteListing.create({
        data: {
          userId,
          listingId,
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              description: true,
              tags: true,
              requirements: true,
              deadline: true,
              created: true,
              updated: true,
            },
          },
        },
      });

      res.status(201).json({
        action: "added",
        message: "Favorite added successfully",
        favorite,
      });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
