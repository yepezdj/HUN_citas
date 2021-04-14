import connection from "../configs/connectDB";
import bcrypt from "bcryptjs";

let createNewUser = (user) => {
    return new Promise(async (resolve, reject) =>{
        try {
            //check email is exist or not
            let check = await checkExistEmail(user.email);
            if (check) {
                console.log(user);
                reject(`Este email "${user.email}" ya existe, porfavor ingrese otro email.`)
            } else {
                //hash password
                let hash = await bcrypt.hash(user.password,10);
                let userItem = {
                    name: user.name,
                    last_name: user.last_name,
                    email: user.email,
                    password: hash,
                    city: user.city,
                    fecha_nac: user.fecha_nac,
                    cellphone: user.cellphone,
                    cedula: user.cedula,         
                    eps: user.eps,
                    sexo: user.sexo,
                    role: 'user'                
                };
                console.log('ola');
                console.log(userItem);
                //create a new account
                connection.query(
                    ' INSERT INTO user set ? ', userItem,
                    function(err, rows) {
                        if (err) {
                            reject(false)
                        }
                        resolve("Create a new user successful");
                    }
                );
            }           
        } catch (e) {
            reject(e);
        }
    });
};

let checkExistEmail = (email) => {
    return new Promise( (resolve, reject) => {
        try {
            connection.query(
                "SELECT * from user where email = ?", email,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    createNewUser: createNewUser,
    checkExistEmail: checkExistEmail
};