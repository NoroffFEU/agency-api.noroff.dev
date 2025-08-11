import { OfferState } from "@prisma/client";

export async function updateApplicantOffer(prismaClient, req, res) {
  const { id } = req.params;

  const originalOffer = await prismaClient.offer.findFirst({
    where: {
      id: id,
      state: OfferState.Pending,
    },
  });

  if (!originalOffer) {
    return res
      .status(400)
      .json({ message: "Only pending offers can be updated by applicants" });
  }

  const { state } = req.body;

  if (state !== "Accepted" && state !== "Rejected") {
    return res
      .status(400)
      .json({ message: "State must be either 'Accepted' or 'Rejected'" });
  }

  try {
    const updatedOffer = await prismaClient.offer.update({
      where: {
        id: id,
      },
      data: {
        state,
        updated: new Date(),
      },
    });

    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
