import { databasePrisma } from "../../../prismaClient.js";

export const handleDelete = async function (req, res) {
  const { id: applicationId } = req.params;

  await databasePrisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  try {
    const result = await databasePrisma.application.delete({
      where: { id: applicationId },
    });

    result.response = "Your Application was successfully deleted";

    return res.status(200).json(result.response);
  } catch (error) {
    return res.status(error.status).json({ message: error.message });
  }
};
