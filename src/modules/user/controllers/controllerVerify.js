export default async function (req, res) {
  try {
    const token = req.params.verificationToken;
    const user = await databasePrisma.user.findUnique({
      where: {
        verificationToken: token,
      },
    });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    await databasePrisma.user.update({
      where: {
        verificationToken: token,
      },
      data: {
        isVerified: true,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
