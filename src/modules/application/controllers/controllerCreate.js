import { databasePrisma } from "../../../prismaClient.js";

export const handleCreate = async function (req) {
  const { applicantId, listingId, coverLetter, companyId } = req.body;

  const hasUserCreatedApplication = await databasePrisma.application.count({
    where: {
      applicantId,
      listingId,
    },
  });

  if (hasUserCreatedApplication > 0) {
    return Promise.resolve({
      status: 409,
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
      return Promise.resolve({
        status: error.status,
        message: error.message,
      });
    } else {
      return Promise.resolve({
        status: 400,
        message:
          "application ID, listing ID, cover letter, and company ID are required",
      });
    }
  }
};
