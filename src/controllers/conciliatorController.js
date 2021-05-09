import connection from "../configs/connectDB";
import gmailController from "../controllers/gmailController";

let getConciliator = (req, res) => {
    if (req.session.conciliator) {
        connection.query(`SELECT agendamiento.idpa,agendamiento.NombreP, agendamiento.ApellidoP, agendamiento.CedulaP, agendamiento.Correo, agendamiento.Especialidad, agendamiento.Doctor, 
        DATE_FORMAT(agendamiento.fecha, "%Y-%m-%d") fecha, agendamiento.hora_ini, agendamiento.Cita, agendamiento.Modo, agendamiento.Afiliacion, agendamiento.Orden, agendamiento.Tipo_documento, 
        agendamiento.Celular, agendamiento.Autorizacion, agendamiento.entidad, agendamiento.Regimen, encuesta.P1, encuesta.P2, encuesta.P3, encuesta.P4, encuesta.P5, encuesta.P6, encuesta.P7,
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
    connection.query('SELECT idpa, NombreP, ApellidoP, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Correo, Cita, Modo, Tipo_documento, Celular, Autorizacion, entidad, Regimen FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.render('./conciliator/aceptar.ejs', {
            datos: datos[0]
        });
    });
};

let aceptar = (req, res) => {

    const estado = 'Aceptada';
    const user = req.session.context;
    const correo = req.body.correo;
    const nombre = req.body.Name;
    const apellido = req.body.Lastname;
    const doctor = req.body.doctor;
    const fecha = req.body.fechaI;
    const hora = req.body.horaI;
    const descripcion = req.body.descripcion;

    var body;
    if (!descripcion) {
        body = `<h4>Estimado/a ${nombre} ${apellido}</h4>
        <div class="text-center mb-2">
    Se le informa que su cita médica ha sido aceptada con el/la ${doctor} para el ${fecha} a las ${hora}
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>
      </div>`;
    } else {
        body = `<h4>Estimado/a ${nombre} ${apellido}</h4>
        <div class="text-center mb-2">
    Se le informa que su cita médica ha sido aceptada con el/la ${doctor} para el ${fecha} a las ${hora}
    <hr class="my-4">
    </div>
    <div class="text-center mb-2">
    ${descripcion}
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>
      </div>`
            ;
    }
    gmailController.sendEmailNormal(correo, 'Solicitud de cita médica-HUN', body)

    connection.query(`UPDATE agendamiento SET Estado = "${estado}" WHERE agendamiento.idpa = "${req.params.idpa}"`, (err, datos) => {
        if (err) {
            res.json(err);
        }
        res.redirect('/conciliator/conciliatormain');
    });

};

//Se extraen los campos de la tabla agendamiento para posteriormente mostrarlos en la página edit
let datosdeclinar = (req, res) => {
    const id = req.params.idpa;
    connection.query('SELECT idpa, NombreP, ApellidoP, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Correo, Tipo_documento, Celular, Autorizacion, entidad, Regimen FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.render('./conciliator/declinar.ejs', {
            datos: datos[0]
        });
    });
};

let declinar = (req, res) => {

    const estado = 'Rechazada';
    const correo = req.body.correo;
    const nombre = req.body.Name;
    const apellido = req.body.Lastname;
    const doctor = req.body.doctor;
    const descripcion = req.body.descripcion;
    console.log(descripcion)
    const body = `<h4>Estimado/a ${nombre} ${apellido}</h4>
    Se le informa que su cita médica ha sido rechada por la/s siguiente/es razón/es: ${descripcion}
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>`;
    gmailController.sendEmailNormal(correo, 'Solicitud de cita médica-HUN', body)

    connection.query('DELETE FROM agendamiento WHERE idpa = ?', [req.params.idpa], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.redirect('/conciliator/conciliatormain');
    });

};

let Citas = (req, res) => {
    if (req.session.conciliator) {
        connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Correo, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Cita, Modo, Afiliacion, Orden, Tipo_documento, Celular, Autorizacion, entidad, Regimen FROM agendamiento WHERE Estado = "Aceptada"', (err, info) => {
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
    connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Especialidad, Doctor, DATE_FORMAT(fecha, "%m-%d-%Y") fecha, hora_ini, Orden, Descripcion, Correo, Cita, Afiliacion, Modo, Tipo_documento, Celular, Autorizacion, entidad, Regimen FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.render('./conciliator/Reprogramar.ejs', {
            datos: datos[0]
        });
    });
};

//Se actualiza la fila de la tabla teniendo en cuenta el parámetro del id y se recarga la página
let updateC = async (req, res) => {
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
        return res.redirect('/consultarCitas');
    });
};


module.exports = {
    getConciliator: getConciliator,
    datosaceptar: datosaceptar,
    aceptar: aceptar,
    datosdeclinar: datosdeclinar,
    declinar: declinar,
    Citas: Citas,
    editC: editC,
    updateC: updateC
}

