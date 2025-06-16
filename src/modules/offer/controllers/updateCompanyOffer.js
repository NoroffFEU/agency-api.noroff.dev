export async function updateCompanyOffer(prismaClient, req, res) {
  const { id } = req.params; // Get offer ID from URL params
  const { state } = req.body; // Only get state from body

  if (!state) {
    return res.status(400).json({
      message: "State is required in the request body.",
    });
  }

  try {
    // Check if offer exists first
    const offer = await prismaClient.offer.findUnique({
      where: {
        id: id,
      },
      include: {
        company: true,
      },
    });

    if (!offer) {
      return res.status(404).json({
        message: `Offer with ID ${id} not found.`,
      });
    }

    // Check if offer is still pending (companies should only update pending offers)
    if (offer.state !== "Pending") {
      return res.status(400).json({
        message: "Only pending offers can be updated by companies.",
      });
    }

    // Validate state values for company updates (they might withdraw or modify)
    if (!["Pending", "Withdrawn"].includes(state)) {
      return res.status(400).json({
        message:
          "Companies can only set offer state to 'Pending' or 'Withdrawn'.",
      });
    }

    // Update offer state
    const updatedOffer = await prismaClient.offer.update({
      where: {
        id: id,
      },
      data: {
        state: state,
        updated: new Date(),
      },
    });

    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(500).json({
      message: "An unexpected error occurred while updating the offer.",
      error: error.message,
    });
  }
}
