import connection from "../configs/connectDB";
import userService from "../services/userService";
import jwt from "jsonwebtoken";

//FUNCIÓN PARA LA PÁGINA PRINCIPAL DEL MÓDULO USUARIO
let getUser = (req, res) => {
    if (req.session.user) {
        return res.render("./user/usermain.ejs", {
            user: req.session.context
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
}


let verifyUser = async (req, res) => {

    var fecha = req.body.date;
    console.log(fecha);

    var nameDoc = req.body.nameDoc;
    console.log(nameDoc);
    var EspeDoc = req.body.EspeDoc;
    console.log(EspeDoc);
    var date = new Date(fecha); //DÍA EN PALABRAS
    var tipo = req.body.tipo;
    console.log(tipo)
    var day = date.getDay();
  
    var pos = 0;
    
    //TRAER HORARIOS DISPONIBLES ++++
    let schedule = await userService.bringSchedule(day, nameDoc, EspeDoc, tipo);
    pos = 0;
    var vec_hora_ini = [];

    Object.keys(schedule).forEach(function (key) {
        vec_hora_ini[pos] = schedule[key].hora_ini;
        pos++;
    });
    console.log('schedule');
    console.log(vec_hora_ini);

    //CITAS PROGRAMADAS y  CITAS PENDIENTES ---
    let apointment = await userService.consultApo(fecha, nameDoc, EspeDoc, tipo);
    pos = 0;
    var vec_apointment = [];

    Object.keys(apointment).forEach(function (key) {
        vec_apointment[pos] = apointment[key].hora_ini;
        pos++;
    });
    console.log('citas');
    console.log(vec_apointment);

    //VER EXCEPCIONES-------------
    let exception = await userService.consultException(fecha, nameDoc, EspeDoc, 'Excepcion', tipo);
    pos = 0;
    var vec_exception = [];

    Object.keys(exception).forEach(function (key) {
        vec_exception[pos] = exception[key].hora_ini;
        pos++;
    });
    console.log('exception');
    console.log(vec_exception);

    //VER ADICIONES+++++++++
    let adicion = await userService.consultException(fecha, nameDoc, EspeDoc, 'Adicion', tipo);
    pos = 0;
    var vec_adicion = [];
    Object.keys(adicion).forEach(function (key) {
        vec_adicion[pos] = adicion[key].hora_ini;
        pos++;
    });
    console.log('adicion');
    console.log(vec_adicion);

    ///VECTOR A MOSTRAR
    var vec_hora_ini = vec_hora_ini.concat(vec_adicion);
    var vec_hora_ini = vec_hora_ini.filter((item, pos) => vec_hora_ini.indexOf(item) === pos)

    vec_hora_ini = vec_hora_ini.filter(function (element) {
        return !vec_exception.includes(element);
    });
    vec_hora_ini = vec_hora_ini.filter(function (element) {
        return !vec_apointment.includes(element);
    });
    console.log('total');
    
    var hora = vec_hora_ini
    res.end(JSON.stringify(hora));
    console.log(hora)
    
}

//SE EXTRAEN LAS ESPECIALIDADES Y SE CONVIERTE EN FORMATO JSON
let espe = (req, res) => {
    connection.query('SELECT Especialidad FROM especialidades ORDER BY Especialidad ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));        
    });
};

let medicina = (req, res) => {
    connection.query('SELECT Doctor FROM medicinageneral ORDER BY Doctor ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));       
    });
};

let medicinaOdont = (req, res) => {
    connection.query('SELECT Doctor FROM odontologiageneral ORDER BY Doctor ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));        
    });
};

let odontologia = (req, res) => {
    connection.query('SELECT Doctor, Especialidad FROM odontologiaespecializada ORDER BY Doctor ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));      
    });
};

let odontologiaE = (req, res) => {
    connection.query('SELECT Especialidad FROM espe_odontologia ORDER BY Especialidad ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));       
    });
};

let odontologiaespecializada = (req, res) => {
    connection.query('SELECT Doctor, Especialidad FROM odontologiaespecializada ORDER BY Doctor ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));       
    });
};

let listaEPS = (req, res) => {
    connection.query('SELECT eps, Prepagada FROM eps ORDER BY eps ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));        
    });
};


let ayuda = (req, res) => {
    connection.query('SELECT Ayudas FROM ayudas_diagnosticas ORDER BY Ayudas ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));        
    });
};

let procedimiento = (req, res) => {
    connection.query('SELECT Procedimientos, Especialidad FROM procedimientos ORDER BY Procedimientos ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));        
    });
};

let doctor_procedimiento = (req, res) => {
    connection.query('SELECT Nombres, Especialidad FROM proc_amb_doctor ORDER BY Nombres ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));        
    });
};


let dr = (req, res) => {
    connection.query('SELECT Especialidad, Nombres FROM doctor ORDER BY Nombres ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result5 = dat
        res.end(JSON.stringify(result5));       
    });
};

let verExcepciones = (req, res) => {
   
    connection.query('SELECT DATE_FORMAT(fecha, "%Y-%m-%d") fecha, Tipo, Doctor, hora_ini, hora_fin, Especialidad FROM ver_excepciones WHERE Tipo = "Adición" AND fecha >= DATE(NOW()) ORDER BY fecha ASC', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result = dat
        res.end(JSON.stringify(result));       
    });
};

//FUNCIÓN PARA MOSTRAR DATOS DE LA SOLICITUD DE CITA DEL USUARIO EN LA TABLA
let tabla = (req, res) => {

    if (req.session.user) {
        var user = req.session.context;
        var id = user.id;
       
        connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Orden, Cita, Afiliacion, Modo, Estado, Tipo_documento, Celular, Autorizacion, entidad, Regimen, Direccion, Barrio, CelularOp, Telefono, Acompañante, Municipio, Descripcion, Estado_civil, Genero FROM agendamiento WHERE idu = ?', id, (err, datos) => {
            if (err) {
                res.json(err);
            }
           
            res.render('./user/usertable.ejs', {
                data: datos,
                user: req.session.context               
            });
        });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
};


let datos = (req, res) => {

    connection.query('SELECT * FROM ver_horarios', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result = dat
        res.end(JSON.stringify(result));       
    });

};

//FUNCIÓN PARA EXTRAER LOS CAMPOS DILIGENCIADOS POR LOS USUARIOS PARA LA SOLICITUD DE CITA MÉDICA E INSERTARLOS EN LA BASE DE DATOS
let agendar = async (req, res) => {
    const datos = req.body;
    var name = req.body.Name;
    var lastname = req.body.Lastname;
    var sexo = req.body.sexo;
    var estado = req.body.estado;
    var Cedula = req.body.Cedula;
    var correo = req.body.email;
    
    var hora = req.body.Horario;
    var fecha = req.body.fecha;
    var number = req.body.number;
    var tipo = req.body.Tipo;
    var user = req.session.context;
   
    var Factura = req.body.Factura;
    var Estado = 'Pendiente';
    var agendada = 'No';
    var descripcion = req.body.descripcion;
    var id = user.id;
    var fecha_exp = req.body.fechaExp;
    var fecha_nac = req.body.fechaNac;
    var direccion = req.body.direccion;
    var barrio = req.body.barrio;
    var departamento, municipio;
    var cellphone1 = req.body.cellphone1;
    var tele = req.body.tele;
    var Option = req.body.Option;
    var person = req.body.persona;

    
    var doctor, espe;
    var Cita = req.body.Cita;
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

    if (Option == '2') {
        departamento = req.body.Departamento;
        municipio = req.body.city;
    } else {
        departamento = 'No aplica';
        municipio = 'No aplica';
    }

    if (!cellphone1) {
        cellphone1 = 'No aplica';
    } else {
        cellphone1 = cellphone1;
    }

    if (!tele) {
        tele = 'No aplica';
    } else {
        tele = tele;
    }

    if (!person) {
        person = 'No aplica';
    } else {
        person = person;
    }

    var p1 = req.body.options;
    var p2 = req.body.options1;
    var p3 = req.body.options2;
    var p4 = req.body.options3;
    var p5 = req.body.options4;
    var p6 = req.body.options5;
    var p7 = req.body.options6;
    var p8 = req.body.options7;
    var p9 = req.body.encuesta;
    var idp;

    if (!p9) {
        p9 = 'No aplica';
    } else {
        p9 = p9;
    }

    var procedimiento = req.body.Procedimientos;
    if(!procedimiento){
        procedimiento = 'No aplica'
    } else{
        procedimiento = req.body.Procedimientos
    }

    var datearray = fecha.split("-");
    var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];

    var linkOrden;

    let JWT_SECRET = process.env.JWT_SECRET;
    const secret = JWT_SECRET;


    //ORDEN SUBIDA
    if (req.files[0]) {
        var Orden = req.files[0].path;
        console.log(Orden);

        const payloadOrden = {
            Orden: Orden,
            id: user.id
        }

        const tokenOrden = jwt.sign(payloadOrden, secret);
        linkOrden = `http://oficinavirtualhun.ddns.net:8080/files/${user.id}/${tokenOrden}`;
        console.log(linkOrden);
    } else {
        linkOrden = `http://oficinavirtualhun.ddns.net:8080/nofiles`;
        console.log(linkOrden);
    }

    var autorizacion;
    if (req.body.autorizacion) {
        autorizacion = req.body.autorizacion;
    } else {
        autorizacion = 'No ingresó el número de autorización';
    }

    var Modo;
    if (Cita == "Ayudas diagnósticas" || Cita == "Procedimiento ambulatorio" || Cita == "Consulta odontología general" || Cita == "Consulta odontología especializada") {
        Modo = 'Presencial'
    } else {
        Modo = req.body.Modo;
    }

    var entidad;
    if (Factura == "EPS") {
        entidad = req.body.entidad
    } else {
        entidad = 'No aplica';
    }

    var regimen;
    if (Factura == "EPS") {
        regimen = req.body.regimen
    } else {
        regimen = 'No aplica';
    }


    console.log(datos);
    console.log(hora)

    let citaExist = await userService.availabilityConsult(Cita, espe, doctor, newdate, hora);

    if (citaExist) {
        let idp = await userService.magic(espe, doctor, newdate, hora, linkOrden, name, lastname,
            Cedula, id, descripcion, Estado, correo, Cita, Modo, Factura, autorizacion, entidad, regimen,
            number, tipo, fecha_exp, direccion, barrio, departamento, municipio, cellphone1, tele, person, fecha_nac, procedimiento, agendada, sexo, estado);

        await userService.survey(p1, p2, p3, p4, p5, p6, p7, p8, p9, idp);

        return res.redirect('/consultar')

    } else {
        return res.redirect('/user/usermain')
    }
}


let edit = async (req, res) => {
    var user = req.session.context;
    const id = req.params.idpa;
    if (req.session.user) {
    connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Especialidad, Doctor, DATE_FORMAT(fecha, "%m-%d-%Y") fecha, hora_ini, Orden, Descripcion, Correo, Cita, Afiliacion, Modo, Celular, entidad, Regimen, Autorizacion, Tipo_documento, DATE_FORMAT(fecha_exp, "%Y-%m-%d") fecha_exp, Direccion, Barrio, Departamento, Municipio, CelularOp, Telefono, Acompañante, DATE_FORMAT(fecha_nac, "%Y-%m-%d") fecha_nac, Procedimiento, Genero, Estado_civil FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.render('./user/useredit.ejs', {
            datos: datos[0],
            user: req.session.context
        });
    });
    } else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
    }
};

//FUNCIÓN PARA ACTUALIZAR INFORMACIÓN SI EL USUARIO DECIDE EDITAR LA INFORMACIÓN CONTENIDA EN LA TABLA
let update = async (req, res) => {
    const id = req.params.idpa;
    var name = req.body.Name;
    var lastname = req.body.Lastname;
    var Cedula = req.body.Cedula;
    var correo = req.body.email;
    var doctor = req.body.Doctores;
    var espe = req.body.opciones;
    var hora = req.body.Horario;
    var fecha = req.body.fecha;
    var number = req.body.number;
    var tipo = req.body.Tipo;

    var Cita = req.body.Cita;
    var Factura = req.body.Factura;
    var Estado = 'Pendiente';
    var descripcion = req.body.descripcion;
    var option = req.body.Option

    var datearray = fecha.split("-");
    var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
    console.log(newdate)
    // console.log(newdate)

    var linkOrden;
    var user = req.session.context;
    let JWT_SECRET = process.env.JWT_SECRET;
    const secret = JWT_SECRET;

    var direccion = req.body.direccion;
    var barrio = req.body.barrio;
    var cellphone1 = req.body.cellphone1;
    var tele = req.body.tele;
    var person = req.body.persona;
    if (!cellphone1) {
        cellphone1 = 'No aplica';
    } else {
        cellphone1 = cellphone1;
    }

    if (!tele) {
        tele = 'No aplica';
    } else {
        tele = tele;
    }

    if (!person) {
        person = 'No aplica';
    } else {
        person = person;
    }

    //ORDEN SUBIDA
    if (req.files[0]) {
        var Orden = req.files[0].path;
        console.log(Orden);

        const payloadOrden = {
            Orden: Orden,
            id: user.id
        }

        const tokenOrden = jwt.sign(payloadOrden, secret);
        linkOrden = `http://oficinavirtualhun.ddns.net:8080/files/${user.id}/${tokenOrden}`;
        console.log(linkOrden);

        connection.query("UPDATE agendamiento SET Orden = ? WHERE idpa = ?", [linkOrden, req.params.idpa], (err, datos) => {
            if (err) {
                res.json(err);
            }
            console.log(datos);           
        });
    } else {
        // linkOrden = 'El paciente no adjuntó orden médica';
        // console.log(linkOrden);
    }

    if (option == '1') {
        connection.query("UPDATE agendamiento SET fecha = ?, hora_ini = ? WHERE idpa = ?", [newdate, hora, req.params.idpa], (err, datos) => {
            if (err) {
                res.json(err);
            }
            console.log(datos);           
        });
    }

    var autorizacion;
    if (req.body.autorizacion) {
        autorizacion = req.body.autorizacion;
    } else {
        autorizacion = 'No ingresó el número de autorización';
    }

    var Modo;
    if (Cita == "Ayudas diagnósticas" || Cita == "Procedimiento ambulatorio" || Cita == "Consulta odontología general" || Cita == "Consulta odontología especializada") {
        Modo = 'Presencial'
    } else {
        Modo = req.body.Modo;
    }

    var entidad;
    if (Factura == "EPS") {
        entidad = req.body.entidad
    } else {
        entidad = 'No aplica';
    }

    var regimen;
    if (Factura == "EPS") {
        regimen = req.body.regimen
    } else {
        regimen = 'No aplica';
    }

    connection.query("UPDATE agendamiento SET NombreP = ?, ApellidoP = ?, CedulaP = ?, Especialidad = ?, Doctor = ?, Descripcion = ?, Cita = ?, Afiliacion = ?, Modo = ?, Correo = ?, entidad = ?, Regimen = ?, Tipo_documento = ?, Celular = ?, Autorizacion = ?, Direccion = ?, Barrio = ?, CelularOp = ?, Telefono = ? WHERE idpa = ?", [name, lastname, Cedula, espe, doctor, descripcion, Cita, Factura, Modo, correo, entidad, regimen, tipo, number, autorizacion, direccion, barrio, cellphone1, tele, req.params.idpa], (err, datos) => {
        if (err) {
            res.json(err);
        }

        console.log(datos);
        return res.redirect('/consultar');
    });
};

//FUNCIÓN PARA ELIMINAR REGISTROS DE LA TABLA DEL USUARIO
let delate = (req, res) => {
    const id = req.params.idpa;
    connection.query('DELETE FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.redirect('/consultar');
    });
};

//SE EXPORTAN LAS FUNCIONES
module.exports = {
    getUser: getUser,
    verifyUser: verifyUser,
    espe: espe,
    dr: dr,
    tabla: tabla,
    datos: datos,
    agendar: agendar,
    edit: edit,
    update: update,
    delate: delate,
    listaEPS: listaEPS,
    ayuda: ayuda,
    procedimiento: procedimiento,
    medicina: medicina,
    medicinaOdont: medicinaOdont,
    odontologia: odontologia,
    odontologiaE: odontologiaE,
    doctor_procedimiento: doctor_procedimiento,
    odontologiaespecializada: odontologiaespecializada,
    verExcepciones: verExcepciones
}
