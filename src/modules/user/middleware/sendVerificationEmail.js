import { v4 as uuidv4 } from "uuid";

export default function sendVerificationEmail(dependency) {
  const { databasePrisma, sendEmail } = dependency;
  return async function (req, res, next) {
    try {
      await databasePrisma.user.update({
        where: { id: req.user.id },
        data: {
          verificationToken: uuidv4(),
        },
      });
      const url = process.env.BASEURL + "/user/verify/" + req.user.id;
      sendEmail({
        to: req.user.email,
        subject: "Verify your email",
        html: `Please click <a href="${url}">this link</a> to verify your email.`,
      });
      res.status(200).json({
        status: "success!",
        message:
          "Verification email sent successfully, please check your email and verify your account.",
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };
}
