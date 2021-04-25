import connection from "../configs/connectDB";

let bringSchedule = (day, nameDoc, EspeDoc) => {
    const semana = ['Lunes', 'Martes', 'Miercoles','Jueves', 'Viernes', 'Sabado'];
    const numDia = [1,2,3,4,5,6]

    try {
        var position = numDia.indexOf(day);
        var diaSemana = semana[position];
        return new Promise((resolve, reject) => {
            try {
                connection.query(
                    `SELECT hora_ini from horarios WHERE dia = "${diaSemana}" AND nombres = "${nameDoc}"
                    AND Especialidad = "${EspeDoc}"`,
                    function(err, rows) {
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

module.exports = {
    bringSchedule: bringSchedule,
}