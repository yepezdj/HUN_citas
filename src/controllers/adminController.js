import adminService from "../services/adminService"


let getAdmin = (req, res) =>{
    if (req.session.admin) {
        return res.render("./admin/adminmain.ejs", {
            user: req.session.context
        });
	} else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
	} 
}



let getException = (req, res) =>{
    if (req.session.admin) {
        return res.render("./admin/adminException.ejs", {
            user: req.session.context
        });
	} else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
	} 
}

let createException = async (req, res) => {
    let exception = {
        hora_ini1: req.body.H1,
        hora_fin1: req.body.H2,
        hora_ini2: req.body.H3,
        hora_fin2: req.body.H4,
        hora_ini3: req.body.H5,
        hora_fin3: req.body.H6,
        doc: req.body.Doctores,
        espec: req.body.opciones,
        fecha: req.body.fecha,
        type: req.body.type,
    };
    console.log(exception);

    await adminService.createNewException(exception);

    return res.redirect("/admin/adminException");
}


let createAdmin = async (req, res) =>{

    let horario = {
        hora_ini1: req.body.H1,
        hora_fin1: req.body.H2,
        hora_ini2: req.body.H3,
        hora_fin2: req.body.H4,
        hora_ini3: req.body.H5,
        hora_fin3: req.body.H6,
        doc: req.body.Doctores,
        espec: req.body.opciones,
        dia: req.body.Dia
    };    
    
    await adminService.createNewSchedule(horario);
   
    res.redirect("/admin/adminmain");
}


module.exports = {    
    getAdmin: getAdmin,
    createAdmin: createAdmin,
    createException: createException,
    getException: getException,
}
