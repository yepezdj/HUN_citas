import connection from "../configs/connectDB";
import bcrypt from "bcrypt"



let findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                "SELECT * from user where email = ? ", email,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let comparePasswordUser = (password, user) => {
    return new Promise(async (resolve, reject) => {
        try {
            await bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    console.log('hola si, sonido')
                    resolve(true);
                } else {
                    console.log('q ise')
                    resolve("The password that you've entered is incorrect");
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let findUserById = (id) => {
    return new Promise((resolve, reject) =>{
        try {
            connection.query("SELECT * from user where id = ?", id, function(err, rows){
                if (err) {
                    reject(err)
                }
                let user = rows[0];
                resolve(user);
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    comparePasswordUser: comparePasswordUser,
    findUserByEmail: findUserByEmail,
    findUserById: findUserById
}