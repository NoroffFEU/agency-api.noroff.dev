import { verifyToken } from "../../utilities/jsonWebToken";
export async function removeOffer(prismaClient, request, response) {
  const { id } = request.params; //this might need to be moved out of this function and into the offerRouter.delete function in routes.js
  let verified = await verifyToken(JWT);
  const token = request.headers.authorization;
  let JWT = token;

  // check if token is valid
  if (!token) {
    return res.status(401).send({
      error: "User has to be authenticated to make this request",
    });
  } else if (token.includes("Bearer")) {
    JWT = token.slice(7);
  }
  if (JWT === undefined) {
    return res.status(401).send({
      message: "No authorization header provided.",
    });
  }
  if (!verified) {
    return res.status(401).send({
      message: "Authorization token is not valid.",
    });
  }

  // incorrect id throw error
  if (!id) {
    return response.status(400).send({ message: "offer id is required" });
  }

  // check that the user is admin of offer company
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
