require('dotenv').config();
import loginService from "../services/loginService"
import jwt from 'jsonwebtoken';
import fs from 'fs';


let getFile = (req, res, next) => {
    const {
        id,
        token
    } = req.params;
    return new Promise(async (resolve, reject) => {
        try {
            //verify user id
            let user = await loginService.findUserById(id)
            if (!user) {
                return res.send(`No cambie el link de conexión.`);
            } else {
                if (Number(id) !== user.id) {
                    return res.send('ID inválida. No cambie el link de conexión.')
                }

                let JWT_SECRET = process.env.JWT_SECRET;
                const secret = JWT_SECRET;
                try {
                    const payload = jwt.verify(token, secret);
                    console.log(payload);
                    var tempFile 
                    if (payload.Orden) {
                        tempFile = payload.Orden;
                    }
                    if (payload.Imagen) {
                        tempFile = payload.Imagen;
                    }

                    fs.readFile(tempFile, function (err, data) {
                        res.contentType("application/pdf");
                        res.send(data);
                    });

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

let getNoFile = (req, res, next) => {
    return res.render("Nofile.ejs");
}

module.exports = {
    getFile: getFile,
    getNoFile: getNoFile
}