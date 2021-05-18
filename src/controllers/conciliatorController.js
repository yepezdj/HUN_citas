import connection from "../configs/connectDB";
import conciliatorService from "../services/conciliatorService";
import gmailController from "../controllers/gmailController";

let getConciliator = (req, res) => {
    if (req.session.conciliator) {
        connection.query(`SELECT agendamiento.idpa,agendamiento.NombreP, agendamiento.ApellidoP, agendamiento.CedulaP, agendamiento.Correo, agendamiento.Especialidad, agendamiento.Doctor, 
        DATE_FORMAT(agendamiento.fecha, "%Y-%m-%d") fecha, DATE_FORMAT(agendamiento.fecha_nac, "%Y-%m-%d") fecha_nac, agendamiento.hora_ini, agendamiento.Cita, agendamiento.Modo, agendamiento.Afiliacion, agendamiento.Orden, agendamiento.Tipo_documento, 
        agendamiento.Celular, agendamiento.Autorizacion, agendamiento.entidad, agendamiento.Regimen, DATE_FORMAT(agendamiento.hora_solicitud, "%Y-%m-%d %H:%i:%S") hora_solicitud, encuesta.P1, encuesta.P2, encuesta.P3, encuesta.P4, encuesta.P5, encuesta.P6, encuesta.P7,
        encuesta.P8, encuesta.P9 FROM agendamiento INNER JOIN encuesta WHERE agendamiento.idpa = encuesta.idpa AND agendamiento.Estado = "Pendiente"`, (err, info) => {
            if (err) {
                res.json(err);
            }
            console.log(info);
            res.render('./conciliator/conciliatormain.ejs', {
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
}

//Se extraen los campos de la tabla agendamiento para posteriormente mostrarlos en la página edit
let datosaceptar = (req, res) => {
    const id = req.params.idpa;
    connection.query('SELECT idpa, NombreP, ApellidoP, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Correo, Cita, Modo, Tipo_documento, Celular, Autorizacion, entidad, Regimen, Procedimiento, DATE_FORMAT(fecha_nac, "%Y-%m-%d") fecha_nac FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.render('./conciliator/aceptar.ejs', {
            datos: datos[0]
        });
    });
};

let aceptar = async (req, res) => {

    const estado = 'Aceptada';
    const datos = req.body;
    const id = req.body.id;
    console.log(datos)
    
    let variablesAceptar = {
        correo: req.body.correo,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        doctor: req.body.doctor,
        fecha: req.body.fecha,
        hora: req.body.hora,
        descripcion: req.body.descripcion,        
    };
    console.log(variablesAceptar);

    await conciliatorService.EmailAceptar(variablesAceptar);

    connection.query(`UPDATE agendamiento SET Estado = "${estado}" WHERE agendamiento.idpa = "${id}"`, (err, datos) => {
        if (err) {
            res.json(err);
        }
        res.redirect('/conciliator/conciliatormain');
    });

};

//Se extraen los campos de la tabla agendamiento para posteriormente mostrarlos en la página edit
// let datosdeclinar = (req, res) => {
//     const id = req.params.idpa;
//     connection.query('SELECT idpa, NombreP, ApellidoP, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Correo, Tipo_documento, Celular, Autorizacion, entidad, Regimen FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
//         if (err) {
//             res.json(err);
//         }
//         console.log(datos);
//         res.render('./conciliator/declinar.ejs', {
//             datos: datos[0]
//         });
//     });
// };

let declinar = async (req, res) => {

    const estado = 'Rechazada';
    const datos = req.body;
    const id = req.body.id;
    console.log(datos)
    
    let variablesDeclinar = {
        correo: req.body.correo,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        doctor: req.body.doctor,
        fecha: req.body.fecha,
        hora: req.body.hora,
        descripcion: req.body.descripcion,        
    };
    console.log(variablesDeclinar);

    await conciliatorService.EmailDeclinar(variablesDeclinar);

    connection.query('DELETE FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.redirect('/conciliator/conciliatormain');
    });

};

let Citas = (req, res) => {
    if (req.session.conciliator) {
        connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Correo, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Cita, Modo, Afiliacion, Orden, Tipo_documento, Celular, Autorizacion, entidad, Regimen, fecha_nac FROM agendamiento WHERE Estado = "Aceptada"', (err, info) => {
            if (err) {
                res.json(err);
            }
            console.log(info);
            res.render('./conciliator/Appoitments.ejs', {
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

let editC = async (req, res) => {
    var user = req.session.context;
    const id = req.params.idpa;
    connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Especialidad, Doctor, DATE_FORMAT(fecha, "%m-%d-%Y") fecha, hora_ini, Orden, Descripcion, Correo, Cita, Afiliacion, Modo, Tipo_documento, Celular, Autorizacion, entidad, Regimen, Tipo_documento, DATE_FORMAT(fecha_exp, "%Y-%m-%d") fecha_exp, Direccion, Barrio, Departamento, Municipio, CelularOp, Telefono, Acompañante, DATE_FORMAT(fecha_nac, "%Y-%m-%d") fecha_nac, Procedimiento FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.render('./conciliator/Reprogramar.ejs', {
            datos: datos[0],
            user: req.session.context
        });
    });
};

//Se actualiza la fila de la tabla teniendo en cuenta el parámetro del id y se recarga la página
let updateC = async (req, res) => {
    const datos = req.body;
    console.log('alo')
    console.log(datos)
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
    console.log('aló')
    

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

    if (req.session.conciliator) {
        connection.query("UPDATE agendamiento SET fecha = ?, hora_ini = ? WHERE idpa = ?", [newdate, hora, id], (err, datos) => {
            if (err) {
                res.json(err);
            }

            console.log(datos);
            return res.redirect('/consultarCitas');
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
};

let ExportarConciliator = (req, res) => {
    if (req.session.conciliator) {
        connection.query('SELECT agendamiento.idpa, agendamiento.NombreP, agendamiento.ApellidoP, agendamiento.Celular, agendamiento.CedulaP, agendamiento.Correo, agendamiento.Estado, agendamiento.idu, agendamiento.Especialidad, agendamiento.Doctor, DATE_FORMAT(agendamiento.fecha, "%d-%m-%Y") fecha, DATE_FORMAT(agendamiento.fecha, "%Y") año, DATE_FORMAT(agendamiento.fecha, "%M") mes, DATE_FORMAT(agendamiento.hora_solicitud, "%d-%m-%Y") hora_solicitud, DATE_FORMAT(agendamiento.fecha_nac, "%d-%m-%Y") fecha_nac, agendamiento.hora_ini, agendamiento.Orden, agendamiento.Tipo_documento, agendamiento.Celular, agendamiento.Autorizacion, agendamiento.entidad, agendamiento.Regimen, agendamiento.Modo, agendamiento.Afiliacion, agendamiento.Cita, agendamiento.Direccion, agendamiento.Barrio, user.sexo FROM agendamiento INNER JOIN user WHERE agendamiento.idu = user.id AND agendamiento.Estado = "Aceptada" AND agendamiento.Agendada = "No"', (err, info) => {
            if (err) {
                res.json(err);
            }
            console.log(info);
            res.render('./conciliator/conciliatorExportar.ejs', {
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

let updateExport = async (req, res) => {
   
    //const id = req.params.idpa;
    var id = req.body.id;    
    console.log(id)
    var agendada = 'Si';

    if (req.session.conciliator) {
        connection.query("UPDATE agendamiento SET Agendada = ? WHERE idpa = ?", [agendada, id], (err, datos) => {
            if (err) {
                res.json(err);
            }

            console.log(datos);            
            return res.redirect('/consultarExportarC');
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
};

module.exports = {
    getConciliator: getConciliator,
    datosaceptar: datosaceptar,
    aceptar: aceptar,
    // datosdeclinar: datosdeclinar,
    declinar: declinar,
    Citas: Citas,
    editC: editC,
    updateC: updateC,
    ExportarConciliator: ExportarConciliator,
    updateExport: updateExport
}

