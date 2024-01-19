import { databasePrisma } from "../../../prismaClient";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export default async function verifyResetPasswordToken(req,res){
    const token = req.params.token;
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await databasePrisma.user.findUnique({
        where: {
            passwordResetToken: hash
        }
    })
if(!user){
    return res.status(400).json({
        message: 'Invalid token'
    })

}
if(user.passwordResetTokenExpires < Date.now()){
    return res.status(400).json({
        message: 'Token expired'
    })
}

const {email,newPassword} = req.body;

const saltRounds = 14;
bcrypt.hash(newPassword, saltRounds, async function(err, hash) {
if(err){
    return res.status(500).json({
        message: 'Error hashing password'
    })}
try{

    await databasePrisma.user.update({where: {email:email}, data: {password: hash}})
    
    res.status(200).json({
        message: 'Password updated successfully'
    })

}catch(err){
   return res.status(500).json({
        message: "Error updating database"
    })}});


}