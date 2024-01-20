export async function updateCompanyOffer(prismaClient, req, res) {
  const { companyId, offerId, state } = req.body;

  if (!companyId) {
    res.status(400).json({
      message: "Company ID is missing from the request body.",
    });
  }
  if (!offerId) {
    res.status(400).json({
      message: "Offer ID is missing from the request body.",
    });
  }

  try {
    // Check if company exists
    const company = await prismaClient.company.findUnique({
      where: {
        id: companyId,
      },
    });
    if (!company) {
      res.status(404).json({
        message: `Company with ID ${companyId} not found.`,
      });
    }

    // Check if offer exists and belongs to the company
    const offer = await prismaClient.offer.findUnique({
      where: {
        id: offerId,
      },
      select: {
        companyId: true,
      },
    });

    if (!offer) {
      res.status(404).json({
        message: `Offer with ID ${offerId} not found.`,
      });
    }
    if (offer.companyId !== companyId) {
      res.status(404).json({
        message: `Offer with ID ${offerId} does not belong to company with ID ${companyId}.`,
      });
    }

    // Update offer state
    const updatedOffer = await prismaClient.offer.update({
      where: {
        id: offerId,
      },
      data: {
        state: state,
      },
    });

    res.status(200).json(updatedOffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An unexpected error occurred while updating the offer.",
    });
  }
}
