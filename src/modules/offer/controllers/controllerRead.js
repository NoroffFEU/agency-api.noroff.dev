export async function offerGetId(prismaClient, request, response) {
  try {
    const { id } = request.params;
    const offer = await prismaClient.offer.findUnique({
      where: {
        id: id,
      },
      include: {
        application: {
          include: {
            applicant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!offer) {
      return response.status(404).json({ message: "Offer not found" });
    }

    response.status(200).json(offer);
  } catch (error) {
    response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function offersGet(prismaClient, request, response) {
  try {
    const offers = await prismaClient.offer.findMany({
      include: {
        application: {
          include: {
            applicant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    response.status(200).json(offers);
  } catch (error) {
    response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
