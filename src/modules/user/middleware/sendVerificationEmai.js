import { databasePrisma } from "../../../prismaClient";
//import sendEmailDependency when ready
import sendVerificationEmailFactory from "./sendVerificationEmailFactory";

const sendVerificationEmail = sendVerificationEmailFactory({
  databasePrisma,
  sendEmail: null, // replace null with sendEmailDependency when ready
});

export default sendVerificationEmail;
