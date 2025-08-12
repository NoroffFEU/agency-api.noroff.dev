import { databasePrisma } from "../../../prismaClient.js";
import { createPrismaQuery } from "../../../utilities/prismaQueryGenerators.js";
import { handlePrismaErrorResponse } from "../../../utilities/handlePrismaErrorResponse.js";

export const getAllUsers = async function (req, res) {
  try {
    const { prismaQuery, page, limit } = createPrismaQuery(req, "users");
    prismaQuery.include = {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    };

    const [users, totalCount] = await Promise.all([
      databasePrisma.user.findMany(prismaQuery),
      databasePrisma.user.count(
        prismaQuery.where ? { where: prismaQuery.where } : {}
      ),
    ]);
    users.forEach((user) => {
      delete user.password;
      delete user.salt;
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.set("X-Current-Page", page);
    res.set("X-Total-Pages", totalPages);

    res.status(200).json(users);
  } catch (error) {
    handlePrismaErrorResponse(error, res);
  }
};

export const getAUser = async function (req, res) {
  try {
    const id = req.params.id;

    const user = await databasePrisma.user.findUnique({
      where: {
        id,
      },
      include: {
        company: {
          include: {
            listings: true,
          },
        },
        offers: true,
        applications: true,
        favorites: {
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
                companyId: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    ["password", "salt"].forEach((field) => delete user[field]);

    if (user.role === "Applicant") {
      if (user.favorites) {
        user.listings = user.favorites.map((fav) => fav.listing);
        delete user.favorites;
      } else {
        user.listings = [];
      }
    } else if (user.role === "Client" && user.company) {
      user.listings = user.company.listings || [];
      if (user.company.listings) {
        delete user.company.listings;
      }
      delete user.favorites;
    } else {
      user.listings = [];
      delete user.favorites;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getAUser:", error);
    res.status(500).json({ ...error, message: "Internal server error" });
  }
};
