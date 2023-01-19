export async function createOffer(prismaClient, request, response) {
  try {
    const {
      listingId,
      applicationId,
      userId,
      applicantId,
      userRole,
      offerState,
    } = request.body;

    const offer = await prismaClient.offer.create({
      data: {
        listingId: listingId,
        applicationId: applicationId,
        userId: userId,
        applicantId: applicantId,
        applicant: userRole,
        state: offerState,
      },
    });

    response.status(200).json(offer);
  } catch (error) {
    console.log(error);
    response.status(400);
  }
}
