
/**
 * Factory function to create a middleware for sending a verification email.
 * @param {Object} dependency - The dependency object.
 * @param {Object} dependency.databasePrisma - The PrismaClient instance.
 * @param {Function} dependency.sendEmail - The function to send an email.
 * @returns {Function} Express middleware function that sends a verification email.
 */

export default function sendVerificationEmailFactory(dependency) {
  const { databasePrisma, sendEmail } = dependency;
  return async function (req, res) {
    try {
      const url = process.env.BASEURL + "/user/verify/" + req.user.verificationToken;
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
