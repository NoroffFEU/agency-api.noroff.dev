import { v4 as uuidv4 } from "uuid";

export default function sendVerificationEmailFactory(dependency) {
  const { databasePrisma, sendEmail } = dependency;
  return async function (req, res) {
    try {
      token = uuidv4();
      await databasePrisma.user.update({
        where: { id: req.user.id },
        data: {
          verificationToken: token,
        },
      });
      const url = process.env.BASEURL + "/user/verify/" + req.user.token;
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
