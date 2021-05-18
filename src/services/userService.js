import connection from "../configs/connectDB";
//import datejs from "datejs";

let bringSchedule = (day, nameDoc, EspeDoc, tipo) => {
    const semana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const numDia = [1, 2, 3, 4, 5, 6]

    try {
        var position = numDia.indexOf(day);
        var diaSemana = semana[position];
        console.log(tipo)
        return new Promise((resolve, reject) => {
            try {
                connection.query(
                    `SELECT hora_ini from horarios WHERE dia = "${diaSemana}" AND Doctor = "${nameDoc}"
                    AND Especialidad = "${EspeDoc}" AND Tipo = "${tipo}"`,
                    function (err, rows) {
                        if (err) {
                            reject(err)
                        }
                        resolve(rows);
                    }
                );
            } catch (err) {
                reject(err);
            }
        });
    } catch (error) {
        reject(error);
    }

};

function convert(date){
    var datearray = date.split("-");
    var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
    return newdate;
}

let consultApo = (fecha, nameDoc, EspeDoc, tipo) => {
    return new Promise((resolve, reject) => {
        try {
            //console.log(fecha);
            var str = convert(fecha);
            //console.log(str);
            connection.query(
                `SELECT hora_ini from agendamiento WHERE fecha = "${str}"  AND Doctor = "${nameDoc}"
                AND Especialidad = "${EspeDoc}"  AND Cita = "${tipo}"`,
                function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let consultException = (fecha, nameDoc, EspeDoc, type, tipo) => {
    return new Promise((resolve, reject) => {
        try {
            //console.log(fecha);
            var str = convert(fecha);
            //console.log(str);
            connection.query(
                `SELECT hora_ini from excepciones WHERE fecha = "${str}" AND Doctor = "${nameDoc}"
                AND Especialidad = "${EspeDoc}" AND Tipo = "${type}" AND tipo_cita = "${tipo}"`,
                function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let survey = (p1, p2, p3, p4, p5, p6, p7, p8, p9, idp) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(idp);
            connection.query(
                `INSERT INTO encuesta (P1, P2, P3, P4, P5, P6, P7, P8, P9, idpa)
                 VALUES ("${p1}", "${p2}", "${p3}", "${p4}", "${p5}", "${p6}", "${p7}", "${p8}", "${p9}","${idp}")`,
                function (err, rows) {
                    if (err) {
                        reject(err);
                    }
                    console.log('ya');
                    resolve("Create a new user successful");
                }
            );

        } catch (err) {
            reject(err);
        }
    });
};


let magic = (espe, doctor, newdate, hora, linkOrden, name, lastname,
    Cedula, id, descripcion, Estado, correo, Cita, Modo, Factura, autorizacion, 
    entidad, regimen, number, tipo, fecha_exp, direccion, barrio, departamento, municipio,
     cellphone1, tele, person, fecha_nac, procedimiento, agendada) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                `INSERT INTO agendamiento (Especialidad, Doctor, Fecha, hora_ini, Orden,
                NombreP, ApellidoP, CedulaP, idu, Descripcion, Estado, Correo, Cita, Modo, 
                Afiliacion, Celular, Tipo_documento, entidad, Regimen, Autorizacion, fecha_exp, 
                Direccion, Barrio, Departamento, Municipio, CelularOp, Telefono, Acompañante, fecha_nac, Procedimiento, Agendada) 
                VALUES ("${espe}", "${doctor}", "${newdate}", "${hora}", "${linkOrden}", "${name}", 
                "${lastname}", "${Cedula}", "${id}", "${descripcion}", "${Estado}", "${correo}", 
                "${Cita}", "${Modo}", "${Factura}", "${number}", "${tipo}", "${entidad}", "${regimen}", 
                "${autorizacion}", "${fecha_exp}", "${direccion}", "${barrio}", "${departamento}", 
                "${municipio}", "${cellphone1}", "${tele}", "${person}", "${fecha_nac}", "${procedimiento}", "${agendada}")`,
                function (err, rows) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows.insertId);
                    //console.log(rows)
                }       
            );

        } catch (err) {
            reject(err);
        }
    });
};



let availabilityConsult = (Cita, espe, doctor, newdate, hora) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(`SELECT * FROM agendamiento WHERE Especialidad = "${espe}" 
                AND Doctor = "${doctor}" AND Cita = "${Cita}" AND Fecha = "${newdate}"
                AND hora_ini = "${hora}"`, (err, datos) => {
                if (err) {
                    res.json(err);
                }
                if (!datos.length) {
                    resolve(true);
                } else {
                    console.log('ya hay cita ese dia');
                    resolve(false);
                }
            });

        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    bringSchedule: bringSchedule,
    consultApo: consultApo,
    consultException: consultException,
    availabilityConsult: availabilityConsult,
    magic: magic,
    survey: survey
}

