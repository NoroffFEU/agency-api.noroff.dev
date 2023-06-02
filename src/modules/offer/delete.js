import { verifyToken } from "../../utilities/jsonWebToken";
export async function removeOffer(prismaClient, request, response) {
  const { id } = request.params; //this might need to be moved out of this function and into the offerRouter.delete function in routes.js
  let verified = await verifyToken(JWT);
  if (verified.companyId === id || verified.role === "Admin") {
    try {
      const offer = await prismaClient.offer.delete({
        where: {
          id: parseInt(id),
        },
      });
      return response
        .status(200)
        .send({ message: "Offer deleted successfully", company });
    } catch (error) {
      if (error) {
        return response
          .status(409)
          .send({ message: "Bad request", error: error });
      } else {
        return response.status(401).send({
          message: "User is not authorized to delete offer",
        });
      }
    }
  }
}
