import { verifyToken } from "../../utilities/jsonWebToken";
export async function removeOffer(prismaClient, request, response) {
  const { id } = request.params; //this might need to be moved out of this function and into the offerRouter.delete function in routes.js
  try {
    const offer = await prismaClient.offer.delete({
      where: {
        id: parseInt(id),
      },
    });

    let verified = await verifyToken(JWT);

    response.status(200);
  } catch (error) {
    response.status(400);
    console.log(error);
  }
}
