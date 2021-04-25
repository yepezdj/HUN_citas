import connection from "../configs/connectDB";
//import datejs from "datejs";

let bringSchedule = (day, nameDoc, EspeDoc) => {
    const semana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const numDia = [1, 2, 3, 4, 5, 6]

    try {
        var position = numDia.indexOf(day);
        var diaSemana = semana[position];
        return new Promise((resolve, reject) => {
            try {
                connection.query(
                    `SELECT hora_ini from horarios WHERE dia = "${diaSemana}" AND Doctor = "${nameDoc}"
                    AND Especialidad = "${EspeDoc}"`,
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

let consultApo = (fecha, nameDoc, EspeDoc) => {
    return new Promise((resolve, reject) => {
        try {
            //console.log(fecha);
            var str = convert(fecha);
            //console.log(str);
            connection.query(
                `SELECT hora_ini from agendamiento WHERE fecha = "${str}"  AND Doctor = "${nameDoc}"
                AND Especialidad = "${EspeDoc}"`,
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

let consultException = (fecha, nameDoc, EspeDoc, type) => {
    return new Promise((resolve, reject) => {
        try {
            //console.log(fecha);
            var str = convert(fecha);
            //console.log(str);
            connection.query(
                `SELECT hora_ini from excepciones WHERE dia = "${str}" AND Doctor = "${nameDoc}"
                AND Especialidad = "${EspeDoc}" AND Especialidad = "${type}"`,
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

module.exports = {
    bringSchedule: bringSchedule,
    consultApo: consultApo,
    consultException: consultException
}