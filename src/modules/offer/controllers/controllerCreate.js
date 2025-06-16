/**
 * Creates an offer in the database for the given application ID and returns the created offer.
 * @async
 * @function createOffer
 * @param {Object} prismaClient - The prisma client instance
 * @param {Object} request - The HTTP request object
 * @param {Object} response - The HTTP response object
 * @returns {Promise<void>} A Promise that resolves when the offer has been created and the HTTP response has been sent.
 * @throws {Error} If there is an error creating the offer.
 * @description
 * - Destructure the application ID and offer state from the request body.
 *  ```js
 *  const { applicationId } = request.body;
 * *  ```
 * * - Validate that the application ID is provided.
 * * - Check if the application exists in the database.
 * * - If the application does not exist, return a 404 error.
 * * - Check if an offer already exists for the application.
 * * - If an offer already exists, return a 409 error.
 * * - Create a new offer with the application ID, listing ID, company ID, user ID, and default state of "Pending".
 * * - Return the created offer with a 201 status code.
 */
export async function createOffer(prismaClient, request, response) {
  try {
    const { applicationId } = request.body;

    if (!applicationId) {
      return response.status(400).json({
        message: "Application ID is required",
      });
    }

    const application = await prismaClient.application.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!application) {
      return response.status(404).json({
        message: "Application not found",
      });
    }

    const existingOffer = await prismaClient.offer.findFirst({
      where: {
        applicationId: applicationId,
      },
    });

    if (existingOffer) {
      return response.status(409).json({
        message: "An offer already exists for this application",
      });
    }

    const offer = await prismaClient.offer.create({
      data: {
        applicationId: applicationId,
        listingId: application.listingId,
        companyId: application.companyId,
        userId: application.applicantId,
        state: "Pending",
      },
    });

    response.status(201).json(offer);
  } catch (error) {
    response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
