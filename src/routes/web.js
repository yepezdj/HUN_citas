import express, { Router } from "express";
import loginController from "../controllers/loginController";
import registerController from "../controllers/registerController";
import auth from "../validation/authValidation";
import homePageController from "../controllers/homePageController";
import forgotpasswordController from "../controllers/forgotpasswordController"
import resetPasswordController from "../controllers/resetPasswordController";

//initPassportLocalUser();

let router = express.Router();


let initWebRoutes = (app) => {
    //router.get("/", loginController.checkLoggedIn, homePageController.getHomePage);
    //router.get("/login",loginController.checkLoggedOut, loginController.getLoginPage);
    router.get("/login", loginController.getLoginPage);
    router.get("/user/usermain", loginController.getUser);
    router.get("/", loginController.getLoginPage);
    router.get("/admin/adminmain", loginController.getAdmin);
    router.get("/conciliator/conciliatormain", loginController.getConciliator);
    /* router.post("/login", passport.authenticate("local", {

        successRedirect: "/",
        ///if rol =user
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    })); */
    router.post("/login", loginController.postLogin);



    router.get("/register", registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createNewUser);
    router.post("/logout", loginController.postLogOut);
    

    router.get('/forgot-password', forgotpasswordController.a);
    router.post('/forgot-password', forgotpasswordController.aa);

    router.get('/reset-password/:id/:token', resetPasswordController.b);

    router.post('/reset-password/:id/:token', auth.validateNewPassword, resetPasswordController.bb);

    /* router.get('/admin/adminmain', (req, res) => {
        return res.render("./admin/adminmain.ejs");
    });
    router.get('/conciliator/adminmain', (req, res) => {
        return res.render("./conciliator/conciliator.ejs");
    }); */
    return app.use("/", router);
};



    

module.exports = initWebRoutes;
