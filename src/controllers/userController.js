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


    var fecha = req.body.date;
    console.log(fecha);
    var festivo = (holiday2021.indexOf(fecha) > -1);

    var nameDoc = req.body.nameDoc;
    console.log(nameDoc);
    var EspeDoc = req.body.EspeDoc;
    console.log(EspeDoc);
    var date = new Date(fecha); //dia en palabras
    
    var day = date.getDay();
    //var year = date.getFullYear();

    //Verificar si es dia se semana 'mm-dd-yy'
    if (day === 6 || day === 0) {
        console.log('es finde');
    } else if (!festivo) {
        var pos = 0;
        //si no es festivo

        //traer horarios disponibles ++++
        let schedule = await userService.bringSchedule(day, nameDoc, EspeDoc);
        pos = 0;
        var vec_hora_ini = [];
        
        Object.keys(schedule).forEach(function (key) {
            vec_hora_ini[pos] = schedule[key].hora_ini;            
            pos++;
        });
        console.log('schedule');
        console.log(vec_hora_ini);

        //CITAS PROGRAMADAS y  CITAS PENDIENTES ---
        let apointment = await userService.consultApo(fecha, nameDoc, EspeDoc);
        pos = 0;
        var vec_apointment = [];
        
        Object.keys(apointment).forEach(function (key) {
            vec_apointment[pos] = apointment[key].hora_ini;
            pos++;
        });
        console.log('citas');
        console.log(vec_apointment);

        //VER EXCEPCIONES-------------
        let exception = await userService.consultException(fecha, nameDoc, EspeDoc, 'Excepcion');
        pos = 0;
        var vec_exception = [];
        
        Object.keys(exception).forEach(function (key) {
            vec_exception[pos] = exception[key].hora_ini;           
            pos++;
        });
        console.log('exception');
        console.log(vec_exception);

        //VER ADICIONES+++++++++
        let adicion = await userService.consultException(fecha, nameDoc, EspeDoc, 'Adicion');
        pos = 0;
        var vec_adicion = [];
        Object.keys(adicion).forEach(function (key) {
            vec_adicion[pos] = adicion[key].hora_ini;
            pos++;
        });
        console.log('adicion');
        console.log(vec_adicion);

        ///VECTOR A MOSTRAR
        vec_hora_ini = vec_hora_ini.filter(function (element) {
            return !vec_exception.includes(element);            
        });
        vec_hora_ini = vec_hora_ini.filter(function (element) {
            return !vec_apointment.includes(element);
        });
        var vec_hora_ini = vec_hora_ini.concat(vec_adicion);
        var vec_hora_ini = vec_hora_ini.filter((item, pos) => vec_hora_ini.indexOf(item) === pos)
        console.log('total');
        // console.log(vec_hora_ini);

        var hora = vec_hora_ini
        res.end(JSON.stringify(hora));
        console.log(hora)
       
        // return vec_hora_ini;      

    }

    // return res.redirect("/user/usermain");
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
    connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Orden, Imagen, Estado FROM agendamiento WHERE CedulaP = ?', cedula, (err, datos) => {
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

//Se extraen todos los campos de la tabla que contiene la información de los horarios y se convierten en formato json
let datos = (req, res) => {

    connection.query('SELECT * FROM ver_horarios', (err, dat) => {
        if (err) {
            res.json(err);
        }
        var result = dat
        res.end(JSON.stringify(result));
        /* console.log(result) */
    });

};



//Se extraen mediante el req.body los elementos llenandos en la página para insertarlos en la tabla agendamiento
let agendar = (req, res) => {
    const datos = req.body;
    var name = req.body.Nombre;
    var lastname = req.body.Apellido;
    var Cedula = req.body.Cedula;
    var correo = req.body.Correo;   
    var doctor = req.body.Doctor; 
    var espe = req.body.Especialidad;
    var hora = req.body.Hora;
    var fecha = req.body.Fecha;
    var Orden = req.body.Orden;
    var Imagen = req.body.Imagen;   
    var Estado = 'Pendiente';
    var descripcion = req.body.description;
    var id = '3';
    var datearray = fecha.split("-");
    var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
    console.log(datos);
    console.log(hora)

    connection.query(
        `INSERT INTO agendamiento (Especialidad, Doctor, Fecha, hora_ini, Orden, Imagen, NombreP, ApellidoP, CedulaP, idu, Descripcion, Estado, Correo) 
        VALUES ("${espe}", "${doctor}", "${newdate}", "${hora}", "${Orden}", "${Imagen}", "${name}", "${lastname}", "${Cedula}", "${id}", "${descripcion}", "${Estado}", "${correo}")`,
        function(err, rows) {
            if (err) {
                res.json(err);
            }
            console.log(rows)
            res.redirect('/user/usermain')
        }
    );
   
}

//Se extraen los campos de la tabla agendamiento para posteriormente mostrarlos en la página edit
let edit = (req, res) => {
    const id = req.params.idpa;
    connection.query('SELECT idpa, NombreP, ApellidoP, CedulaP, Especialidad, Doctor, DATE_FORMAT(fecha, "%Y-%m-%d") fecha, hora_ini, Orden, Imagen, Descripcion, Correo FROM agendamiento WHERE idpa = ?', [id], (err, datos) => {
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
    var name = req.body.Nombre;
    var lastname = req.body.Apellido;
    var Cedula = req.body.Cedula;
    var correo = req.body.Correo;   
    var doctor = req.body.Doctor; 
    var espe = req.body.Especialidad;
    var hora = req.body.Hora;
    var fecha = req.body.Fecha;
    var Orden = req.body.Orden;
    var Imagen = req.body.Imagen;   
    var Estado = 'Pendiente';
    var descripcion = req.body.description;    
    var datearray = fecha.split("-");
    var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
    connection.query("UPDATE agendamiento SET CedulaP = ?, Especialidad = ?, Doctor = ?, fecha = ?, hora_ini = ?, Orden = ?, Imagen = ?, Descripcion = ? WHERE idpa = ?", [Cedula, espe, doctor, newdate, hora, Orden, Imagen, descripcion, id], (err, datos) => {
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
    datos: datos,    
    agendar: agendar,
    edit: edit,
    update: update,
    delate: delate
}