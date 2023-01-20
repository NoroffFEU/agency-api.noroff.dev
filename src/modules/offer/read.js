export async function offer(prismaClient, request, response) {
  try {
    const { id } = request.params;
    const offer = await prismaClient.offer.findUnique({
      where: {
        id: String(id),
      },
    });
    if (!offer) {
      response.status(404).json({ message: "Offer not found :(" });
      return;
    }
    response.send(offer);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: `${error}` });
  }
}

export async function offers(prismaClient, request, response) {
  try {
    const offers = await prismaClient.offer.findMany();
    if (!offers) {
      response.status(404).json({ message: "Offers not found :(" });
      return;
    } else if (offers.length === 0) {
      response.status(404).json({ message: "Offers not found :(" });
      return;
    }
    response.send(offers);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: `${error}` });
  }
}
