import express, { Router } from "express";
import loginController from "../controllers/loginController";
import registerController from "../controllers/registerController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";
import homePageController from "../controllers/homePageController";
import forgotpasswordController from "../controllers/forgotpasswordController"
import resetPasswordController from "../controllers/resetPasswordController";



initPassportLocal();

let router = express.Router();


let initWebRoutes = (app) => {
    router.get("/", loginController.checkLoggedIn, homePageController.getHomePage);
    router.get("/login",loginController.checkLoggedOut, loginController.getLoginPage);

    router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }));

    router.get("/register", registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createNewUser);
    router.post("/logout", loginController.postLogOut);
    return app.use("/", router);
};

router.get('/forgot-password', forgotpasswordController.a);
router.post('/forgot-password', forgotpasswordController.aa);

router.get('/reset-password/:id/:token', resetPasswordController.b);

router.post('/reset-password/:id/:token', auth.validateNewPassword, resetPasswordController.bb);

module.exports = initWebRoutes;
