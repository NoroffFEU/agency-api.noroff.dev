import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const findCompanyById = async (databasePrisma, req, res) => {
  try {
    const id = req.params.id;
    if (id === undefined) {
      return res
        .status(400)
        .json({ message: "Bad request, company id is undefined" });
    }

    let verifiedAdmin = false;
    const token = req.headers.authorization;
    let readyToken = token;
    if (token !== undefined) {
      readyToken = token.slice(7);
    }
    //verify token
    let verified;
    if (readyToken !== undefined) {
      verified = await verifyToken(readyToken);
      if (verified.companyId === id) {
        verifiedAdmin = true;
      }
    }

    const company = await databasePrisma.company.findUnique({
      where: {
        id,
      },
      include: {
        applications: verifiedAdmin,
        offers: verifiedAdmin,
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
      },
    });

    if (!company) {
      return res.status(400).json({ message: "Could not find company!" });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ ...error, message: "Internal server error" });
  }
};
