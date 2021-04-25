import connection from "../configs/connectDB";
import userService from "../services/userService"

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

    const holiday2021 = ['01-01-2021', // Año Nuevo
        '01-11-2021', // Día de los Reyes Magos
        '03-22-2021', // Día de San José
        '04-01-2021', // Jueves Santo
        '04-02-2021', // Viernes Santo
        '05-01-2021', // Día del Trabajador
        '05-17-2021', // Día de la Ascensión
        '06-07-2021', // Corpus Cristi
        '06-14-2021', // Sagrado Corazón
        '07-05-2021', // San Pedro y San Pablo
        '07-20-2021', // Día de la Independencia
        '08-07-2021', // Batalla de Boyacá
        '08-16-2021', // La asunción de la Virgen
        '10-18-2021', // Día de la Raza
        '11-01-2021', // Día de los Difuntos
        '11-15-2021', // Independencia de Cartagena
        '12-08-2021', // Día de la Inmaculada Concepción
        '12-25-2021', // Navidad
    ];


    var fecha = req.body.fecha;
    var festivo = (holiday2021.indexOf(fecha) > -1);

    var nameDoc = req.body.Doctores;
    var EspeDoc = req.body.opciones;
    var date = new Date(fecha); //dia en palabras
    var day = date.getDay();
    //var year = date.getFullYear();

    //Verificar si es dia se semana 'mm-dd-yy'
    if (day === 6 || day === 0) {
        console.log('es finde');
    } else if (!festivo) {
        //si no es festivo

        //ver si hay alguna cita con ese medico ese dia y traerla
    

        //traer horarios disponibles
        let schedule = await userService.bringSchedule(day, nameDoc, EspeDoc);
        var pos = 0;
        var vec_hora_ini=[];

        Object.keys(schedule).forEach(function(key) {
            vec_hora_ini[pos]= schedule[key].hora_ini;       
            pos++;   
        });

        console.log(vec_hora_ini);

      
        

    }

    return res.redirect("/user/usermain");
}

//Se extraen las especialidades y se convierten en formato json
let espe = (req, res) => {
    connection.query('SELECT Especialidad FROM especialidades', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result4 = dat
        res.end(JSON.stringify(result4));
        /* console.log(result4) */
    });
};

//Se extraen los nombres de los médicos y se convierten en formato json
let dr = (req, res) => {
    connection.query('SELECT Especialidad, Nombres FROM doctor', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result5 = dat
        res.end(JSON.stringify(result5));
        /* console.log(result5) */
    });
};

//Se extraen campos de la tabla agendamiento y son enviados a la página tabla para posteriormente ser mostrados
let tabla = (req, res) => {

    var user = req.session.context;
    /* console.log(user) */
    var cedula = user.cedula;
    /* console.log(cedula); */
    // console.log(req.session.user)
    connection.query('SELECT a.idpa, a.NombreP, a.ApellidoP, a.CedulaP, a.Especialidad, a.Doctor, a.FechaInicio, a.FechaFin, a.Orden, a.Imagen, a.Estado FROM agendamiento a WHERE a.CedulaP = ?', cedula, (err, datos) => {
        if (err) {
            res.json(err);
        }
        /* console.log(datos); */
        res.render('./user/usertable.ejs', {
            data: datos,
            //user: req.user
        });
    });
};

let agendaDatos = (req, res) => {

    connection.query('SELECT * FROM eventos', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result2 = dat
        res.end(JSON.stringify(result2));
        /* console.log(result2) */
    });

};

//Se extraen todos los campos de la tabla que contiene la información de los horarios y se convierten en formato json
let datos = (req, res) => {

    connection.query('SELECT * FROM eventos', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result = dat
        res.end(JSON.stringify(result));
        /* console.log(result) */
    });

};

let fechas = (req, res) => {

    connection.query('SELECT FechaInicio FROM agendamiento', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result3 = dat
        res.end(JSON.stringify(result3));
        /* console.log(result3) */
    });

};

//Se extraen mediante el req.body los elementos llenandos en la página para insertarlos en la tabla agendamiento
let agendar = (req, res) => {
    const datos = req.body;
    var id2 = '3';
    var correo = req.body.email;
    var titulo = req.body.title;
    var doctor = req.body.name;
    var inicio = req.body.start;
    var fin = req.body.end;
    var descripcion = req.body.description;
    var name = req.body.Name;
    var lastname = req.body.Lastname;
    var espe = req.body.opciones;
    var Orden = req.body.Orden;
    var Imagen = req.body.Imagen;
    var Cedula = req.body.Cedula;
    var Estado = 'Pendiente'
    console.log(datos);

    connection.query('INSERT INTO agendamiento (Titulo, NombreP, ApellidoP, CedulaP, Especialidad, Doctor, FechaInicio, FechaFin, Orden, Imagen, Descripcion, Estado, Correo, idu) VALUES ("' + titulo + '","' + name + '","' + lastname + '","' + Cedula + '","' + espe + '", "' + doctor + '", "' + inicio + '", "' + fin + '","' + Orden + '", "' + Imagen + '", "' + descripcion + '", "' + Estado + '", "' + correo + '", "' + id2 + '")', (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        // res.redirect('/');
    });
}

//Se extraen los campos de la tabla agendamiento para posteriormente mostrarlos en la página edit
let edit = (req, res) => {
    const id = req.params.idpa;
    connection.query('SELECT idpa, Titulo, NombreP, ApellidoP, CedulaP, Especialidad, Doctor, FechaInicio, FechaFin, Orden, Imagen, Descripcion FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
        if (err) {
            res.json(err);
        }
        console.log(datos);
        res.render('./user/useredit.ejs', {
            datos: datos[0]
        });
    });
};

//Se actualiza la fila de la tabla teniendo en cuenta el parámetro del id y se recarga la página
let update = (req, res) => {
    const id = req.body.id;
    const t = req.body.title;
    const c = req.body.Cedula;
    const e = req.body.opciones;
    const d = req.body.name;
    const pi = req.body.start;
    const pf = req.body.end;
    const o = req.body.Orden;
    const i = req.body.Imagen;
    const dc = req.body.description;
    console.log(e)
    connection.query("UPDATE agendamiento SET Titulo = ?, CedulaP = ?, Especialidad = ?, Doctor = ?, FechaInicio = ?, FechaFin = ?, Orden = ?, Imagen = ?, Descripcion = ? WHERE idpa = ?", [t, c, e, d, pi, pf, o, i, dc, id], (err, datos) => {
        console.log(datos);
        res.redirect('/consultar');
    });
};

//Se elemina la fila de la tabla teniendo en cuenta el parámetro del id y se recarga la página
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

//Se exportan las variables que contienen las funciones 
module.exports = {
    getUser: getUser,
    verifyUser: verifyUser,
    espe: espe,
    dr: dr,
    tabla: tabla,
    fechas: fechas,
    datos: datos,
    agendaDatos: agendaDatos,
    agendar: agendar,
    edit: edit,
    update: update,
    delate: delate
}