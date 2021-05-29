import connection from "../configs/connectDB";
import {validationResult} from "express-validator";
import registerService from "../services/registerService";

let getPageRegister = (req, res) => {
    return res.render("register.ejs", {
        errors: req.flash("errors")
    });
};

let createNewUser = async (req, res) => {
    //validate required fields
  
    //create a new user
    try{
        let newUser = {
            name: req.body.name,
            last_name: req.body.last_name,            
            sexo: req.body.sexo,            
            cellphone: req.body.cellphone,           
            email: req.body.email,
            password: req.body.password
        };
        await registerService.createNewUser(newUser);
        return res.redirect("/login");

    }catch(e){
        req.flash("errors", e);
        return res.redirect("/register");

    }
};

let departamentos = (req, res) => {
    connection.query('SELECT * FROM departamentos ORDER BY Departamento ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));
        /* console.log(result4) */
    });
};

let municipio = (req, res) => {
    connection.query('SELECT * FROM municipios ORDER BY Municipio ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));
        /* console.log(result4) */
    });
};

module.exports = {
    getPageRegister: getPageRegister,
    createNewUser: createNewUser,
    departamentos: departamentos,
    municipio: municipio
};