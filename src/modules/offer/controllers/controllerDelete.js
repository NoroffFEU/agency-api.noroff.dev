export async function removeOffer(prismaClient, request, response) {
  try {
    const { id } = request.params;

    const offer = await prismaClient.offer.delete({
      where: {
        id: id, // Keep as string, don't parseInt
      },
    });

    response.status(200).json({
      message: "Offer deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return response.status(404).json({
        message: "Offer not found",
      });
    }
    response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
