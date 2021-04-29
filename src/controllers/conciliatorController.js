import connection from "../configs/connectDB";
import gmailController from "../controllers/gmailController";

let getConciliator = (req, res) =>{
    if (req.session.conciliator) {
        connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Correo, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Orden, Imagen FROM agendamiento WHERE Estado = "Pendiente"',(err,info) => {
            if(err){
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
    connection.query('SELECT idpa, NombreP, ApellidoP, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Correo FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
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
    const body =  `<h4>Estimado/a ${nombre} ${apellido}</h4>
    <h5>Se le informa que su cita médica ha sido aceptada con el/la ${doctor} para el ${fecha} a las ${hora}</h5>
    `;
    gmailController.sendEmailNormal(correo, 'Solicitud de cita médica-HUN', body)   
           
    connection.query("UPDATE citashun.agendamiento SET Estado = ? WHERE agendamiento.idpa = ?", [estado,req.params.idpa], (err, datos) => {
        console.log(datos);
        res.redirect('/conciliator/conciliatormain');
    });
    
};

//Se extraen los campos de la tabla agendamiento para posteriormente mostrarlos en la página edit
let datosdeclinar = (req, res) => {
    const id = req.params.idpa;
    connection.query('SELECT idpa, NombreP, ApellidoP, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Correo FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
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
    const body =  `<h4>Estimado/a ${nombre} ${apellido}</h4>
    <h5>Se le informa que su cita médica ha sido rechada por la/s siguiente/es razón/es: ${descripcion}</h5>
    `;
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
        connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Correo, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Orden, Imagen FROM agendamiento WHERE Estado = "Aceptada"',(err,info) => {
            if(err){
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

module.exports = {    
    getConciliator: getConciliator,
    datosaceptar:datosaceptar,
    aceptar:aceptar,
    datosdeclinar:datosdeclinar,
    declinar:declinar,
    Citas: Citas
}

