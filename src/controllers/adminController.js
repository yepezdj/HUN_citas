import connection from "../configs/connectDB";

let getAdmin = (req, res) =>{
    if (req.session.admin) {
        return res.render("./admin/adminmain.ejs", {
            user: req.session.context
        });
	} else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
	} 
}

//Se extraen las especialidades y se convierten en formato json
let espeAdmin = (req,res) => {   
    connection.query('SELECT Especialidad FROM especialidades', (err,dat) => {
        if(err){
            res.json(err);
        }
            var result4 = dat
            res.end(JSON.stringify(result4));
            console.log(result4)             
    });    
};

//Se extraen los nombres de los médicos y se convierten en formato json
let drAdmin = (req,res) => {   
    connection.query('SELECT Especialidad, Nombres FROM doctor',(err,dat) => {
        if(err){
            res.json(err);
        }
            var result5 = dat
            res.end(JSON.stringify(result5));
            console.log(result5)             
    });    
};

let datosAdmin = (req,res) => {   
    connection.query('SELECT ideventos, Titulo, Especialidad, Medico, FechaI, FechaF, Color FROM eventos',(err,dat) => {
        if(err){
            res.json(err);
        }
        var result3 = dat
        res.end(JSON.stringify(result3));
        console.log(result3)             
    });
};

let añadirHorarios = (req,res) => {
   
    var titulo = req.body.title;
    var esp = req.body.especialidad;
    var dr = req.body.medico;
    var inicio = req.body.FechaI;
    var fin = req.body.FechaF;    
    var color = req.body.Color;
    
    console.log(titulo);    
    console.log(inicio)
    
    connection.query('INSERT INTO eventos (Titulo, Especialidad, Medico, FechaI, FechaF, Color) VALUES ("' + titulo + '", "' + esp + '", "' + dr + '", "' + inicio + '", "' + fin + '", "' + color + '")', (err,datos) => {
        if(err){
            res.json(err);
        }
            console.log(datos);
            res.redirect('/admin/adminmain');
    });   
}

let delateAdmin = (req,res) => {
    const id = req.body.id;  
    console.log(id) 
    connection.query('DELETE FROM eventos WHERE ideventos = ?', [id], (err,datos) => {
            if(err){
                res.json(err);
            }
            console.log(datos);
            res.redirect('/admin/adminmain');
    });    
};

let updateAdmin = (req, res) => {

    const id = req.body.id;     
    var titulo = req.body.title;
    var esp = req.body.especialidad;
    var dr = req.body.medico;
    var inicio = req.body.FechaI;
    var fin = req.body.FechaF;    
    var color = req.body.Color;
             
    connection.query("UPDATE eventos SET Titulo = ?, Especialidad = ?, Medico = ?, FechaI = ?, FechaF = ?, Color = ? WHERE ideventos = ?", [titulo, esp, dr, inicio, fin, color, id], (err, datos) => {
        console.log(datos);
        res.redirect('/admin/adminmain');
    });
    
};

module.exports = {    
    getAdmin: getAdmin,
    espeAdmin:espeAdmin,
    drAdmin:drAdmin,
    datosAdmin: datosAdmin,
    añadirHorarios: añadirHorarios,
    delateAdmin:delateAdmin,
    updateAdmin:updateAdmin 
}
