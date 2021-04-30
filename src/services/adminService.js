import connection from "../configs/connectDB";

let createNewSchedule = async (horario) => {
    const interval = "30";
    //console.log(horario);
    if (horario.hora_ini1 !== '' && horario.hora_fin1 !== '') {
        var view1 = {
            dia: horario.dia,
            hora_ini: horario.hora_ini1,
            hora_fin: horario.hora_fin1,
            Doctor: horario.doc,
            Especialidad: horario.espec     
        }
        await saveViewSchedule(view1);

        var starttime = horario.hora_ini1;
        var endtime = horario.hora_fin1;
        var timeslots1 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots1.push(starttime);
        }
        timeslots1.pop();
        console.log(timeslots1);
        await saveSchedule(horario.dia, horario.doc, horario.espec, timeslots1);
        console.log(timeslots1);
    }
    if (horario.hora_ini2 !== '' && horario.hora_fin2 !== '') {
        var view2 = {
            dia: horario.dia,
            hora_ini: horario.hora_ini2,
            hora_fin: horario.hora_fin2,
            Doctor: horario.doc,
            Especialidad: horario.espec     
        }
        await saveViewSchedule(view2);

        var starttime = horario.hora_ini2;
        var endtime = horario.hora_fin2;
        var timeslots2 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots2.push(starttime);
        }
        timeslots2.pop();
        await saveSchedule(horario.dia, horario.doc, horario.espec, timeslots2);
        console.log(timeslots2);
    }
    if (horario.hora_ini3 !== '' && horario.hora_fin3 !== '') {

        var view3 = {
            dia: horario.dia,
            hora_ini: horario.hora_ini3,
            hora_fin: horario.hora_fin3,
            Doctor: horario.doc,
            Especialidad: horario.espec     
        }
        await saveViewSchedule(view3);

        var starttime = horario.hora_ini3;
        var endtime = horario.hora_fin3;
        var timeslots3 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots3.push(starttime);
        }
        timeslots3.pop();
        await saveSchedule(horario.dia, horario.doc, horario.espec, timeslots3);
        console.log(timeslots3);
    }

};

let createNewException = async (exception) => {
    const interval = "30";
    //console.log(exception);
    if (exception.hora_ini1 !== '' && exception.hora_fin1 !== '') {  

        var starttime = exception.hora_ini1;
        var endtime = exception.hora_fin1;
        var timeslots1 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots1.push(starttime);
        }
        timeslots1.pop();
        //console.log(timeslots1);
        await saveException(exception.fecha, exception.type, exception.doc, exception.espec, timeslots1);
        console.log(timeslots1);
    }
    if (exception.hora_ini2 !== '' && exception.hora_fin2 !== '') {
        var starttime = exception.hora_ini2;
        var endtime = exception.hora_fin2;
        var timeslots2 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots2.push(starttime);
        }
        timeslots2.pop();
        await saveException(exception.fecha, exception.type, exception.doc, exception.espec, timeslots2);
        console.log(timeslots2);
    }
    if (exception.hora_ini3 !== '' && exception.hora_fin3 !== '') {

        var starttime = exception.hora_ini3;
        var endtime = exception.hora_fin3;
        var timeslots3 = [starttime];

        while (starttime != endtime) {
            starttime = addMinutes(starttime, interval);
            timeslots3.push(starttime);
        }
        timeslots3.pop();
        await saveException(exception.fecha, exception.type, exception.doc, exception.espec, timeslots3);
        console.log(timeslots3);
    }

};

let saveSchedule = (dia, doc, espec, horas) => {
    return new Promise(async (resolve, reject) =>{
        try {
            console.log(horas);
            //create a new account
            horas.forEach(element => {
                connection.query(
                    `INSERT INTO horarios (dia, hora_ini, Doctor, Especialidad) 
                    VALUES ("${dia}", "${element}", "${doc}", "${espec}")`,
                    function(err, rows) {
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

let saveException = (fecha, tipo, doc, espec, horas) => {
    return new Promise(async (resolve, reject) =>{
        try {
            console.log(horas);
            var datearray = fecha.split("-");
            var newdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];
            console.log(newdate)
            //create a new account
            horas.forEach(element => {
                connection.query(
                    `INSERT INTO excepciones (fecha, hora_ini, Doctor, Especialidad, Tipo) 
                    VALUES ("${newdate}", "${element}", "${doc}", "${espec}","${tipo}")`,
                    function(err, rows) {
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
    return new Promise(async (resolve, reject) =>{
        try {
            //console.log(view);
            //create a new account
            connection.query(
                ' INSERT INTO ver_horarios set ? ', view,
                function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("New schedule view created");
                }
            );          
        } catch (e) {
            reject(e);
        }
    });
}


function addMinutes (time, minutes) {
    var date = new Date(new Date('01/01/2015 ' + time).getTime() + minutes * 60000);
    var tempTime = ((date.getHours().toString().length == 1) ? '0' + date.getHours() : date.getHours()) + ':' +
      ((date.getMinutes().toString().length == 1) ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
      ((date.getSeconds().toString().length == 1) ? '0' + date.getSeconds() : date.getSeconds());
    return tempTime;
}

module.exports = {
    createNewSchedule: createNewSchedule,
    createNewException:createNewException,
    addMinutes: addMinutes
};