import { databasePrisma } from "../../../prismaClient";

function sendResetPasswordFactory(dependency){
    return async function sendResetPassword(req, res, ){
        const { sendMail } = dependency;
        try{
            const { email } = req.body;
            const user = await databasePrisma.user.update({
                where: {
                    email
                },
                data:{
                    passwordResetToken: hash,
                    passwordResetTokenExpires: Date.now() + 10 * 6 * 1000
                }
            })
           
            if(!user){
                return res.status(400).json({message: 'Invalid email'});
            }
            
            const token = crypto.randomBytes(20).toString('hex');
            const hash = crypto.createHash('sha256').update(token).digest('hex');
const resetUrl = process.env.BASE_URL + '/users/newPassword/' + token;

const mailOptions = {
    from: 'noroffagency@someMailDomain.com', // sender address
    to: user.email, // receiver's email address
    subject: 'Password Reset', // Subject line
    html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
           <p>Please click on the following link, or paste this into your browser to complete the process within 10 minutes of receiving it</p>
           <a href="${resetUrl}">Reset Password</a>
           <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`, // HTML body
  };
    await sendMail(mailOptions);
            res.status(200).json({
                message: 'Reset password email sent successfully'
            });
        }catch(err){
            res.status(500).json({status:"failed",message: err});
        }
    }
}

//placeholder sendMail function, replace with real one
function sendMail(mailOptions){
    console.log({mailOptions});
}


 const sendResetPassword = sendResetPasswordFactory({sendMail});

 export default sendResetPassword