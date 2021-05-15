import connection from "../configs/connectDB";
import adminService from "../services/adminService";
import gmailController from "../controllers/gmailController";


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

let Ver_Horario = (req, res) =>{
    if (req.session.admin) {
        connection.query('SELECT dia, hora_ini, hora_fin, Tipo, Especialidad, Doctor FROM ver_horarios', (err, info) => {
            if (err) {
                res.json(err);
            }
            /* console.log(datos); */
            res.render('./admin/admindoctorhorario.ejs', {
                user: req.session.context,
                info: info,
                //user: req.user
            });
        });
        // return res.render("./admin/adminmain.ejs", {
        //     user: req.session.context
        // });
	} else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
	} 
}

let createException = async (req, res) => {

    var doctor, espe;
    var Cita = req.body.cita;
    if(Cita == 'Consulta especializada'){
        doctor = req.body.Doctores;
        espe = req.body.opciones;
    } else if(Cita == 'Procedimiento ambulatorio'){
        doctor = req.body.Doctores2;
        espe = req.body.opciones2;
    } else if(Cita == 'Consulta odontología especializada'){
        doctor = req.body.Doctores3;
        espe = req.body.opciones3;
    } else if(Cita == 'Ayudas diagnósticas'){
        doctor = req.body.Ayudas;
        espe = 'No aplica';
    } else if(Cita == 'Consulta medicina general'){
        doctor = req.body.Doctores4;
        espe = 'No aplica';
    } else if(Cita == 'Consulta odontología general'){
        doctor = req.body.Doctores5;
        espe = 'No aplica';
    }

    let exception = {
        hora_ini1: req.body.H1,
        hora_fin1: req.body.H2,
        hora_ini2: req.body.H3,
        hora_fin2: req.body.H4,
        hora_ini3: req.body.H5,
        hora_fin3: req.body.H6,
        tipo: Cita,        
        espec: espe,
        doc: doctor,
        fecha: req.body.fecha,
        type: req.body.type,
    };
    console.log(exception);

    await adminService.createNewException(exception);

    return res.redirect("/admin/adminException");
}


let createAdmin = async (req, res) =>{


    var doctor, espe;
    var Cita = req.body.cita;
    if(Cita == 'Consulta especializada'){
        doctor = req.body.Doctores;
        espe = req.body.opciones;
    } else if(Cita == 'Procedimiento ambulatorio'){
        doctor = req.body.Doctores2;
        espe = req.body.opciones2;
    } else if(Cita == 'Consulta odontología especializada'){
        doctor = req.body.Doctores3;
        espe = req.body.opciones3;
    } else if(Cita == 'Ayudas diagnósticas'){
        doctor = req.body.Ayudas;
        espe = 'No aplica';
    } else if(Cita == 'Consulta medicina general'){
        doctor = req.body.Doctores4;
        espe = 'No aplica';
    } else if(Cita == 'Consulta odontología general'){
        doctor = req.body.Doctores5;
        espe = 'No aplica';
    }
    let horario = {
        hora_ini1: req.body.H1,
        hora_fin1: req.body.H2,
        hora_ini2: req.body.H3,
        hora_fin2: req.body.H4,
        hora_ini3: req.body.H5,
        hora_fin3: req.body.H6,
        tipo: Cita,        
        espec: espe,
        doc: doctor,
        dia: req.body.Dia
    };   
    console.log(horario)
    await adminService.createNewSchedule(horario);
   
    res.redirect("/admin/adminmain");
}

let exceptions = (req, res) => {

    connection.query('SELECT DATE_FORMAT(fecha, "%Y-%m-%d") fecha, Tipo, Doctor, hora_ini, Especialidad FROM excepciones', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result = dat
        res.end(JSON.stringify(result));
        /* console.log(result) */
    });

};

let CitasAdmin = (req, res) => {
    if (req.session.admin) {
        connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Correo, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Orden, Tipo_documento, Celular, Autorizacion, entidad, Regimen, Modo, Afiliacion, Cita FROM agendamiento WHERE Estado = "Aceptada"',(err,info) => {
            if(err){
                res.json(err);
            }
                console.log(info);
                res.render('./admin/adminAppoitments.ejs', {
                    info: info,
                    user: req.session.context
                    //user: req.user
                });
        });      
	} else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
	} 
};

let editA = async (req, res) => {
    var user = req.session.context;
    const id = req.params.idpa;
    connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Especialidad, Doctor, DATE_FORMAT(fecha, "%m-%d-%Y") fecha, hora_ini, Orden, Descripcion, Correo, Cita, Afiliacion, Modo, Tipo_documento, Celular, Autorizacion, entidad, Regimen FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.render('./admin/adminReprogramar.ejs', {
            datos: datos[0]
        });
    });
};

//Se actualiza la fila de la tabla teniendo en cuenta el parámetro del id y se recarga la página
let updateA = async (req, res) => {
    const id = req.params.idpa;
    var name = req.body.Name;
    var lastname = req.body.Lastname;
    var Cedula = req.body.Cedula;
    var correo = req.body.email;
    var doctor = req.body.Doctores;
    var espe = req.body.opciones;
    var hora = req.body.Horario;
    var fecha = req.body.fecha1;

    var Cita = req.body.Cita;
    var Factura = req.body.Factura;
    var descripcion = req.body.descripcion;

    console.log(fecha)
    var datearray = fecha.split("-");
    var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
    // console.log(fecha)
    console.log(newdate)

    var Modo;
    if (Cita == "Ayudas diagnósticas" || Cita == "Proceso de dermatología") {
        Modo = 'Presencial'
    } else {
        Modo = req.body.Modo;
    }

    const body = `<h4>Estimado/a ${name} ${lastname}</h4>
    Se le informa que su cita médica ha sido reprogramada con el/la ${doctor} para el ${newdate} a las ${hora}
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>`;
    gmailController.sendEmailNormal(correo, 'Reprogramación de cita médica-HUN', body)

    connection.query("UPDATE agendamiento SET fecha = ?, hora_ini = ?, Descripcion = ?, Cita = ?, Modo = ? WHERE idpa = ?", [newdate, hora, descripcion, Cita, Modo, id], (err, datos) => {
        if (err) {
            res.json(err);
        }

        console.log(datos);
        return res.redirect('/consultarCitasAdmin');
    });
};

module.exports = {    
    getAdmin: getAdmin,
    createAdmin: createAdmin,
    createException: createException,
    getException: getException,
    exceptions: exceptions,
    CitasAdmin: CitasAdmin,
    editA: editA,
    updateA: updateA,
    Ver_Horario: Ver_Horario   
}
