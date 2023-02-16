import { databasePrisma } from "../../../prismaClient.js";

export const handleEdit = async function (req, res) {
  const { id: applicationId } = req.params;
  const { coverLetter } = req.body;

  await databasePrisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (coverLetter === undefined) {
    return res.status(409).json({ message: "Cover letter is mandatory" });
  }

  try {
    const result = await databasePrisma.application.update({
      where: { id: applicationId },
      data: {
        coverLetter,
      },
    });

    result.response = "Your Application is updated successfully";

    return res.status(200).json(result);
    // return { status: 200, data: result };
  } catch (error) {
    return res.status(error.status).json({ message: error.message });
  }
};
