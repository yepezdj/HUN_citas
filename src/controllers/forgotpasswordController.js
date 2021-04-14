require('dotenv').config();
import registerService from "../services/registerService";
import loginService from "../services/loginService"
import gmailController from "../controllers/gmailController"
import jwt from 'jsonwebtoken';

let a = (req, res) =>{
    return res.render("forgot-password.ejs");
};

let aa = (req, res, next) => {
    const {email} = req.body;
    return new Promise(async (resolve, reject) =>{
        try {
        //verify user
        let check = await registerService.checkExistEmail(email);
        if (!check) {
            console.log(check);
            return res.render("forgot-password",
            {errors: email});
        } else {
            //create 1 time link
            let JWT_SECRET = process.env.JWT_SECRET;
            let user = await loginService.findUserByEmail(email)
            const secret = JWT_SECRET + user.password
            const payload = {
                email: email,
                id: user.id
            }
            const token = jwt.sign(payload, secret,{expiresIn: '30m'});
            const link =`http://localhost/reset-password/${user.id}/${token}`;
            console.log(link);
            gmailController.sendEmailNormal(user.email, 'hola',link)
            res.send('El link para recuperar la contraseña ha sido enviado a tu email.')

        }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    a: a,
    aa: aa
}