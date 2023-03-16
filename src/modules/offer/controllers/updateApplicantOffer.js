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
      .json({ message: "Only pending offers can be updated" });
  }

  const { state, ...offer } = req.body;

  if (!(state == "Accepted" || state == "Rejected")) {
    return res
      .status(400)
      .json({ message: "State must be either 'Accepted' or 'Rejected'" });
  }

  try {
    const updateApplicantOffer = await prismaClient.offer.update({
      where: {
        id: id,
      },
      data: {
        state,
        ...offer,
      },
    });
    res.status(200).json(updateApplicantOffer);
  } catch (error) {
    res.status(400);
  }
}
