import express, { Router } from "express";
import loginController from "../controllers/loginController";
import registerController from "../controllers/registerController";
import auth from "../validation/authValidation";
import userController from "../controllers/userController";
import adminController from "../controllers/adminController";
import conciliatorController from "../controllers/conciliatorController";
import forgotpasswordController from "../controllers/forgotpasswordController"
import resetPasswordController from "../controllers/resetPasswordController";

//initPassportLocalUser();

let router = express.Router();


let initWebRoutes = (app) => {
    //LOGIN
    router.get("/", loginController.getLoginPage);
    router.get("/login", loginController.getLoginPage);
    router.post("/login", loginController.postLogin);
    router.post("/logout", loginController.postLogOut);

    //REGISTER
    router.get("/register", registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createNewUser);


    //ROUTES
    router.get("/user/usermain", userController.getUser);
    router.get("/admin/adminmain", adminController.getAdmin);
    router.get("/conciliator/conciliatormain", conciliatorController.getConciliator);
    
    //FORGOT AND RESET PASSWORD ROUTES
    router.get('/forgot-passwordRest', forgotpasswordController.Rest);
    router.get('/forgot-password', forgotpasswordController.a);
    router.post('/forgot-password', forgotpasswordController.aa);
    router.get('/reset-password/:id/:token', resetPasswordController.b);
    router.post('/reset-password/:id/:token', auth.validateNewPassword, resetPasswordController.bb);
    
    //RUTAS PARA LA PÁGINA DE USUARIO
    router.post('/fechas',userController.fechas);  
    router.post('/datos',userController.datos);
    router.post('/add',userController.agendar);
    router.post('/agendaDatos',userController.agendaDatos);
    router.get('/consultar',userController.tabla);   
    router.post('/agenda',userController.espe);
    router.post('/doctor',userController.dr);
    router.get('/delete/:idpa',userController.delate); 
    router.get('/update/:idpa',userController.edit);
    router.post('/update/:idpa',userController.update); 

    //RUTAS PARA LA PÁGINA DE CONCILIADOR    
    router.get('/aceptar/:idpa',conciliatorController.datosaceptar);
    router.post('/aceptar/:idpa',conciliatorController.aceptar);
    router.get('/declinar/:idpa',conciliatorController.datosdeclinar);
    router.post('/declinar/:idpa',conciliatorController.declinar);

    //RUTAS PARA LA PÁGINA DE ADMINISTRADOR   
    router.post('/agendaAdmin',adminController.espeAdmin);
    router.post('/doctorAdmin',adminController.drAdmin);
    router.post('/datosAdmin',adminController.datosAdmin);
    router.post('/addAdmin',adminController.añadirHorarios);
    router.post('/delate/:ideventos',adminController.delateAdmin);
    router.post('/actualizar/:ideventos',adminController.updateAdmin);

    return app.use("/", router);
};

module.exports = initWebRoutes;
