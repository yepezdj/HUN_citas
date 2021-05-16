import connection from "../configs/connectDB";

let createNewSchedule = async (horario) => {
    const interval = "20";
    //console.log(horario);
    if (horario.hora_ini1 !== '' && horario.hora_fin1 !== '') {
        var view1 = {
            dia: horario.dia,
            hora_ini: horario.hora_ini1,
            hora_fin: horario.hora_fin1,
            Tipo: horario.tipo,
            Especialidad: horario.espec,
            Doctor: horario.doc
        }
        var idview = await saveViewSchedule(view1);

        var starttime = horario.hora_ini1;
        var endtime = horario.hora_fin1;
        var timeslots1 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots1.push(starttime);
        }
        timeslots1.pop();
        //console.log(timeslots1);
        await saveSchedule(horario.dia, horario.doc, horario.espec, timeslots1, horario.tipo, idview);
        //console.log(timeslots1);
    }
    if (horario.hora_ini2 !== '' && horario.hora_fin2 !== '') {
        var view2 = {
            dia: horario.dia,
            hora_ini: horario.hora_ini2,
            hora_fin: horario.hora_fin2,
            Tipo: horario.tipo,
            Especialidad: horario.espec,
            Doctor: horario.doc
        }
        var idview = await saveViewSchedule(view2);

        var starttime = horario.hora_ini2;
        var endtime = horario.hora_fin2;
        var timeslots2 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots2.push(starttime);
        }
        timeslots2.pop();
        await saveSchedule(horario.dia, horario.doc, horario.espec, timeslots2, horario.tipo, idview);
        console.log(timeslots2);
    }
    if (horario.hora_ini3 !== '' && horario.hora_fin3 !== '') {

        var view3 = {
            dia: horario.dia,
            hora_ini: horario.hora_ini3,
            hora_fin: horario.hora_fin3,
            Tipo: horario.tipo,
            Especialidad: horario.espec,
            Doctor: horario.doc
        }
        var idview = await saveViewSchedule(view3);

        var starttime = horario.hora_ini3;
        var endtime = horario.hora_fin3;
        var timeslots3 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots3.push(starttime);
        }
        timeslots3.pop();
        await saveSchedule(horario.dia, horario.doc, horario.espec, timeslots3, horario.tipo, idview);
        console.log(timeslots3);
    }

};

let createNewException = async (exception) => {
    const interval = "20";
    //console.log(exception);
    if (exception.hora_ini1 !== '' && exception.hora_fin1 !== '') {

        var datearray = exception.fecha.split("-");
        var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
        console.log(newdate)

        var view1 = {
            tipo_cita: exception.tipo,
            Especialidad: exception.espec,
            Doctor: exception.doc,
            hora_ini: exception.hora_ini1,
            hora_fin: exception.hora_fin1,
            fecha: newdate,
            Tipo: exception.type,
        }
        var idview = await saveViewException(view1);

        var starttime = exception.hora_ini1;
        var endtime = exception.hora_fin1;
        var timeslots1 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots1.push(starttime);
        }
        timeslots1.pop();
        //console.log(timeslots1);
        await saveException(exception.fecha, exception.type, exception.doc, exception.espec, timeslots1, exception.tipo, idview);
        console.log(timeslots1);
    }
    if (exception.hora_ini2 !== '' && exception.hora_fin2 !== '') {

        var view2 = {
            tipo_cita: exception.tipo,
            Especialidad: exception.espec,
            Doctor: exception.doc,
            hora_ini: exception.hora_ini2,
            hora_fin: exception.hora_fin2,
            fecha: exception.fecha,
            Tipo: exception.type,
        }
        var idview = await saveViewException(view2);

        var starttime = exception.hora_ini2;
        var endtime = exception.hora_fin2;
        var timeslots2 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots2.push(starttime);
        }
        timeslots2.pop();
        await saveException(exception.fecha, exception.type, exception.doc, exception.espec, timeslots2, exception.tipo, idview);
        console.log(timeslots2);
    }
    if (exception.hora_ini3 !== '' && exception.hora_fin3 !== '') {

        var view3 = {
            tipo_cita: exception.tipo,
            Especialidad: exception.espec,
            Doctor: exception.doc,
            hora_ini: exception.hora_ini3,
            hora_fin: exception.hora_fin3,
            fecha: exception.fecha,
            Tipo: exception.type,
        }
        var idview = await saveViewException(view3);

        var starttime = exception.hora_ini3;
        var endtime = exception.hora_fin3;
        var timeslots3 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots3.push(starttime);
        }
        timeslots3.pop();
        await saveException(exception.fecha, exception.type, exception.doc, exception.espec, timeslots3, exception.tipo, idview);
        console.log(timeslots3);
    }

};

let saveSchedule = (dia, doc, espec, horas, tipo, idview) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(horas);
            //create a new account
            horas.forEach(element => {
                connection.query(
                    `INSERT INTO horarios (dia, hora_ini, Tipo, Especialidad, Doctor, id_view) 
                    VALUES ("${dia}", "${element}", "${tipo}", "${espec}", "${doc}", "${idview}")`,
                    function (err, rows) {
                        if (err) {
                            reject(false)
                        }
                        resolve("Create a new SCHEDULE successful");
                    }
                );
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

let saveException = (fecha, type, doc, espec, horas, tipo, view) => {
    return new Promise(async (resolve, reject) => {
        try {
            //onsole.log(horas);
            var datearray = fecha.split("-");
            var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
            console.log(newdate)
            //create a new account
            horas.forEach(element => {
                connection.query(
                    `INSERT INTO excepciones (fecha, hora_ini, tipo_cita, Especialidad, Doctor, Tipo, id_view) 
                    VALUES ("${newdate}", "${element}", "${tipo}", "${espec}", "${doc}", "${type}", "${view}")`,
                    function (err, rows) {
                        if (err) {
                            console.log(err)
                            // reject(false)   
                        }
                        resolve("Create a new EXCEPTION successful");
                    }
                );
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

let saveViewSchedule = (view) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log(view);
            //create a new account
            connection.query(
                ' INSERT INTO ver_horarios set ? ', view,
                function (err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve(rows.insertId);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
}

let saveViewException = (view) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log(view);
            //create a new account
            connection.query(
                ' INSERT INTO ver_excepciones set ? ', view,
                function (err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve(rows.insertId);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
}

let query_ver_horarios = () => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.query(`SELECT * FROM ver_horarios`, (err, data1) => {
                if (err) {
                    res.json(err);
                }
                resolve(data1);
            });
        } catch (e) {
            reject(e);
        }
    });
}

let query_ver_excepciones = () => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.query(`SELECT idExcepcion, tipo_cita, Especialidad, Doctor, hora_ini, hora_fin,
            DATE_FORMAT(fecha, "%Y-%m-%d") fecha, Tipo FROM ver_excepciones`, (err, data2) => {
                if (err) {
                    res.json(err);
                }
                resolve(data2);
            });
        } catch (e) {
            reject(e);
        }
    });
}




function addMinutes(time, minutes) {
    var date = new Date(new Date('01/01/2015 ' + time).getTime() + minutes * 60000);
    var tempTime = ((date.getHours().toString().length == 1) ? '0' + date.getHours() : date.getHours()) + ':' +
        ((date.getMinutes().toString().length == 1) ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
        ((date.getSeconds().toString().length == 1) ? '0' + date.getSeconds() : date.getSeconds());
    return tempTime;
}

module.exports = {
    createNewSchedule: createNewSchedule,
    createNewException: createNewException,
    addMinutes: addMinutes,
    query_ver_horarios: query_ver_horarios,
    query_ver_excepciones: query_ver_excepciones
};