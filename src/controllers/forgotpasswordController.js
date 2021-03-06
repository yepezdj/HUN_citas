require('dotenv').config();
import registerService from "../services/registerService";
import loginService from "../services/loginService"
import gmailController from "../controllers/gmailController"
import jwt from 'jsonwebtoken';

let a = (req, res) =>{
    return res.render("forgot-password.ejs", {
        errors: req.session.noexist
    });
};

let aa = (req, res, next) => {
    const {email} = req.body;
    console.log(email)
    return new Promise(async (resolve, reject) =>{
        try {
        //verify user
        let check = await registerService.checkExistEmail(email);
        if (!check) {
            console.log(check);
            req.session.noexist = {errors: (`No existe un usuario con este email: ${email}`)};
            return res.redirect("/forgot-password");
            /* res.render("forgot-password.ejs",
            {errors: (`No existe un usuario con este email: ${email}`)}); */
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
            const link =`http://3.17.161.209:8080/reset-password/${user.id}/${token}`;
            console.log(link);
            const body = `<h4>Estimado/a</h4>
            Para recuperar la contraseña de su cuenta, por favor acceder al siguiente link:
            <hr class="my-4">
            ${link}
            <hr class="my-4">
            <div class="text-center mb-2">
              ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
              <a href="#" class="register-link">
              (57) (5) 3858131
              </a>`;

            gmailController.sendEmailNormal(user.email, 'Recuperar contraseña Hospital Universidad del Norte',body)
            //res.send('El link para recuperar la contraseña ha sido enviado a tu email.');
            req.session.fperror = {msg: (`El link para recuperar la contraseña ha sido enviado a tu email.`)};
            return res.redirect("/forgot-passwordRest");

        }
        } catch (e) {
            reject(e);
        }
    });
};

let Rest = (req, res) =>{
    return res.render("forgot-passwordRest.ejs", {
        msg: req.session.fperror
    });
};

module.exports = {
    a: a,
    aa: aa,
    Rest: Rest
}