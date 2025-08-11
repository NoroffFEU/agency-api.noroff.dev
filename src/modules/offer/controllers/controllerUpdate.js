import { OfferState } from "@prisma/client";

export async function updateOffer(prismaClient, req, res, userId = null) {
  const { id } = req.params;
  const { state } = req.body;

  if (!state) {
    return res.status(400).json({
      message: "State is required in the request body.",
    });
  }

  const validStates = ["Pending", "Accepted", "Rejected"];
  if (!validStates.includes(state)) {
    return res.status(400).json({
      message: `Invalid state. Valid states are: ${validStates.join(", ")}`,
    });
  }

  try {
    const offer = await prismaClient.offer.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            applicant: true,
            listing: {
              include: {
                company: true,
              },
            },
          },
        },
        company: true,
      },
    });

    if (!offer) {
      return res.status(404).json({
        message: `Offer with ID ${id} not found.`,
      });
    }

    if (offer.state !== OfferState.Pending) {
      return res.status(400).json({
        message: "Only pending offers can be updated.",
      });
    }

    let user = null;
    if (userId) {
      user = await prismaClient.user.findUnique({
        where: { id: userId },
        include: {
          company: true,
        },
      });
    }

    if (user?.role === "Applicant") {
      if (!["Accepted", "Rejected"].includes(state)) {
        return res.status(400).json({
          message:
            'Applicants can only set offer state to "Accepted" or "Rejected".',
        });
      }

      if (offer.userId !== user.id) {
        return res.status(403).json({
          message: "You can only update your own offers.",
        });
      }
    } else if (user?.role === "Client") {
      if (!["Pending"].includes(state)) {
        return res.status(400).json({
          message: 'Companies can only set offer state to "Pending".',
        });
      }

      if (!user.companyId) {
        return res.status(403).json({
          message: "You must be associated with a company to update offers.",
        });
      }

      const canUpdateOffer =
        offer.companyId === user.companyId ||
        offer.application.listing.company.id === user.companyId;

      if (!canUpdateOffer) {
        return res.status(403).json({
          message: "You can only update offers from your company.",
        });
      }
    } else {
      return res.status(403).json({
        message: "Only applicants and company clients can update offers.",
      });
    }

    const updatedOffer = await prismaClient.offer.update({
      where: { id },
      data: {
        state: OfferState[state],
        updated: new Date(),
      },
    });

    res.status(200).json(updatedOffer);
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({
      message: "An unexpected error occurred while updating the offer.",
      error: error.message,
    });
  }
}
