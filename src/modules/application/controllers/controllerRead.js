import { databasePrisma } from "../../../prismaClient.js";

export const findAllApplications = async function (req, res) {
  try {
    const include = {
      listing: {
        select: {
          id: true,
          title: true,
          tags: true,
          description: true,
          requirements: true,
          deadline: true,
          created: true,
          updated: true,
          companyId: true,
        },
      },
      applicant: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
      offers: true,
      _count: {
        select: {
          offers: true,
        },
      },
    };

    const applications = await databasePrisma.application.findMany({
      include,
    });

    const transformedApplications = applications.map((app) => {
      const transformed = { ...app };

      if (transformed.listing) {
        transformed.listing.authorId = transformed.listing.companyId;
        delete transformed.listing.companyId;
      }

      if (transformed.applicant) {
        transformed.applicant.userName = transformed.applicant.firstName;
        delete transformed.applicant.firstName;
      }

      return transformed;
    });

    return res.status(200).json(transformedApplications);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const findApplicationById = async function (req, res) {
  try {
    const { id } = req.params;

    const include = {
      listing: {
        select: {
          id: true,
          title: true,
          tags: true,
          description: true,
          requirements: true,
          deadline: true,
          created: true,
          updated: true,
          companyId: true,
        },
      },
      applicant: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
      offers: true,
      _count: {
        select: {
          offers: true,
        },
      },
    };

    const application = await databasePrisma.application.findUnique({
      where: { id },
      include,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const transformed = { ...application };

    if (transformed.listing) {
      transformed.listing.authorId = transformed.listing.companyId;
      delete transformed.listing.companyId;
    }

    if (transformed.applicant) {
      transformed.applicant.userName = transformed.applicant.firstName;
      delete transformed.applicant.firstName;
    }

    return res.status(200).json(transformed);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
