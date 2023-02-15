import { databasePrisma } from "../../../prismaClient.js";

export const handleCreate = async function (req, res) {
  const { applicantId, listingId, coverLetter, companyId } = req.body;

  if (
    applicantId === undefined ||
    listingId === undefined ||
    coverLetter === undefined ||
    companyId === undefined
  ) {
    return res.status(400).json({
      message:
        "application ID, listing ID, cover letter, and company ID are required",
    });
  }

  const listing = await databasePrisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    return res.status(400).json({ message: "Listing doesn't exist" });
  }

  if (listing.companyId !== companyId) {
    return res.status(400).json({ message: "Company doesn't exist" });
  }

  const user = await databasePrisma.user.findUnique({
    where: {
      id: applicantId,
    },
    include: { applications: true },
  });

  if (!user) {
    return res.status(400).json({ message: "User doesn't exist" });
  }

  const hasUserCreatedApplication = user.applications.find((application) => {
    return application.listingId === listingId;
  });

  if (hasUserCreatedApplication) {
    return res.status(409).json({
      message: "You've already created an application on this listing",
    });
  }

  try {
    const result = await databasePrisma.application.create({
      data: {
        applicantId,
        listingId,
        coverLetter,
        companyId,
      },
    });

    return result;
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
  }
};
