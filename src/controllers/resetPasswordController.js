require('dotenv').config();
import {validationResult} from "express-validator";
import loginService from "../services/loginService"
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import connection from "../configs/connectDB";


let b = (req, res, next) => {
    const {id, token} = req.params;
    return new Promise(async (resolve, reject) =>{
        try {
        //verify user id
        let user = await loginService.findUserById(id)
        if (!user) {
            return res.send(`No cambie el link de conexión.`);
        } else {
            if (Number(id) !== user.id){
                console.log(user.id);  
                console.log(typeof user.id);
                console.log(id);
                console.log(typeof id);
                return res.send('ID inválida. No cambie el link de conexión.')
            }

            let JWT_SECRET = process.env.JWT_SECRET;
            const secret = JWT_SECRET + user.password
            try {
                const payload = jwt.verify(token, secret);
                res.render("reset-password",
                {email: user.email});
                
            } catch (error) {
                console.log(error.message);
                res.send(error.message);
            }
        }
        } catch (e) {
            reject(e);
        }
    });  
    
};

let bb = (req, res, next) => {
    //validate required fields
    const {id, token} = req.params;
    const {password, password2} = req.body;
    return new Promise(async (resolve, reject) =>{
        let user = await loginService.findUserById(id);
        let errorsArr = [];
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            let errors = Object.values(validationErrors.mapped());
            errors.forEach((item) => {
                errorsArr.push(item.msg);
            });
            return res.render("reset-password",
            {email: user.email, errors: errorsArr});
        }
        try {
            //verify user id
            if (!user) {
                return res.send(`No cambie el link de conexión.`);
            } else {
                let JWT_SECRET = process.env.JWT_SECRET;
                const secret = JWT_SECRET + user.password
                try {
                    const payload =jwt.verify(token, secret)
                    //validate passwords
                    let hash = await bcrypt.hash(password,10);
                    connection.query(
                        `UPDATE user SET password = "${hash}" WHERE (id = "${user.id}")`,
                        function(err, rows) {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                    return res.redirect("/login");
                } catch (error) {
                    console.log(error.message);
                    res.send(error.message);
                }
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    b: b,
    bb: bb
}