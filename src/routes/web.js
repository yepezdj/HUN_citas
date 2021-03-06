import express, { Router } from "express";
import loginController from "../controllers/loginController";
import registerController from "../controllers/registerController";
import auth from "../validation/authValidation";
import userController from "../controllers/userController";
import adminController from "../controllers/adminController";
import conciliatorController from "../controllers/conciliatorController";
import forgotpasswordController from "../controllers/forgotpasswordController"
import resetPasswordController from "../controllers/resetPasswordController";
import filesController from "../controllers/filesController";
import multer from "multer";
import path from "path";

//PARA ALMACENAR LOS ARCHIVOS QUE SON SUBIDOS POR LOS USUARIOS
const storage = multer.diskStorage({ destination: '/home/ubuntu/HUN_citas/uploads',
filename: function (req, file, cb) {
    cb(null, 'Archivo'+'-'+Date.now()+
    path.extname(file.originalname) );
    }
});

const upload = multer({
    storage: storage
});

let router = express.Router();


let initWebRoutes = (app) => {
    //RUTAS PARA LA PÁGINA DE LOGIN
    router.get("/", loginController.getLoginPage);
    router.get("/login", loginController.getLoginPage);
    router.post("/login", loginController.postLogin);
    router.post("/logout", loginController.postLogOut);

    //RUTAS PARA LA PÁGINA DE REGISTRO
    router.get("/register", registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createNewUser);
    router.post("/departamentos", registerController.departamentos);
    router.post("/municipio", registerController.municipio);

    //RUTAS QUE REDIRECCIONAN A LA PÁGINA PRINCIPAL DE CADA MÓDULO
    router.get("/user/usermain", userController.getUser);
    router.get("/admin/adminmain", adminController.getAdmin);
    router.get("/conciliator/conciliatormain", conciliatorController.getConciliator);
    
    //RUTAS PARA FORGOT AND RESET PASSWORD 
    router.get('/forgot-passwordRest', forgotpasswordController.Rest);
    router.get('/forgot-password', forgotpasswordController.a);
    router.post('/forgot-password', forgotpasswordController.aa);
    router.get('/reset-password/:id/:token', resetPasswordController.b);
    router.post('/reset-password/:id/:token', auth.validateNewPassword, resetPasswordController.bb);
    
    //RUTA DE ARCHIVOS SUBIDOS POR EL USUARIO
    router.get('/files/:id/:token', filesController.getFile);
    router.get('/nofiles', filesController.getNoFile);
   
    //RUTAS PARA LA PÁGINA DE USUARIO    
    router.post('/datos',userController.datos);
    router.post('/add', upload.array('images',1), userController.agendar); 
    router.get('/consultar',userController.tabla);   
    router.post('/agenda',userController.espe);
    router.post('/doctor',userController.dr);
    router.post('/listaEPS',userController.listaEPS);
    router.get('/delete/:idpa',userController.delate); 
    router.get('/update/:idpa', upload.array('images',1), userController.edit);
    router.post('/update/:idpa', upload.array('images',1), userController.update);
    router.post('/verifyUser', userController.verifyUser);
    router.post('/ayuda', userController.ayuda);
    router.post('/procedimiento', userController.procedimiento);
    router.post('/doctor_procedimiento', userController.doctor_procedimiento);
    router.post('/medicina', userController.medicina);
    router.post('/medicinaOdont', userController.medicinaOdont);
    router.post('/odontologia', userController.odontologia);
    router.post('/odontologiaE', userController.odontologiaE);
    router.post('/odontologiaespecializada', userController.odontologiaespecializada);
    router.post('/verExcepciones',  userController.verExcepciones); 

    
    //RUTAS PARA LA PÁGINA DE CONCILIADOR    
    router.get('/consultarCitas',conciliatorController.Citas);
    router.get('/consultar/:idpa',conciliatorController.datosaceptar);
    router.get('/consultarExportarC',conciliatorController.ExportarConciliator); 
    router.post('/updateExport',conciliatorController.updateExport); 
    router.post('/aceptar/:idpa',conciliatorController.aceptar);    
    router.post('/declinar/:idpa',conciliatorController.declinar);
    router.get('/updateC/:idpa', upload.array('images',1), conciliatorController.editC);
    router.post('/updateC/:idpa', upload.array('images',1), conciliatorController.updateC);

    //RUTAS PARA LA PÁGINA DE ADMINISTRADOR  
    router.get('/admin/adminException', adminController.getException)
    router.post('/createAdmin', adminController.createAdmin);
    router.post('/createException',  adminController.createException); 
    router.post('/exceptions',  adminController.exceptions); 
    router.get('/consultarCitasAdmin',adminController.CitasAdmin); 
    router.get('/consultarExportarA',adminController.ExportarAdmin); 
    router.post('/updateExportA',adminController.updateExportA);
    router.get('/consultarHorariosAdmin',adminController.Ver_Horario); 
    router.get('/updateA/:idpa', upload.array('images',1), adminController.editA);
    router.post('/updateA/:idpa', upload.array('images',1), adminController.updateA);
    router.get('/deleteHora/:idHorario',adminController.deleteHorario);
    router.get('/deleteHorario',adminController.tableHorario);
    router.get('/deleteExcep/:idExcepcion',adminController.deleteException);

    return app.use("/", router);
};

module.exports = initWebRoutes;
