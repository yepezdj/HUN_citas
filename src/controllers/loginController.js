import loginService from "../services/loginService";

let postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;  
    try {
        await loginService.findUserByEmail(email).then(async (user) => {
            if (!user) {
                req.session.context = {errors: (`No existe un usuario con este email: ${email}`)};
                return res.redirect("/login");
            }
            if (user) {
                let match = await loginService.comparePasswordUser(password, user);
                if (match === true) {
                    if (user.role==='user') {
                        req.session.user = true;
                        req.session.context = user;
                        return res.redirect("/user/usermain");
                    }
                    if (user.role==='admin') {
                        req.session.admin = true;
                        req.session.context = user;
                        return res.redirect("/admin/adminmain");
                    }
                    if (user.role==='conciliator') {
                        req.session.conciliator = true;
                        req.session.context = user;
                        return res.redirect("/conciliator/conciliatormain");
                    }

                } else {
                    req.session.context = {errors: (`Contraseña incorrecta`)};
                return res.redirect("/login");
                }
            }
        });
    } catch (err) {
        console.log(err);
        return done(null, false, { message: err });
    }  
};

//ESTO NO VA A AQUÍ
let getUser = (req, res) =>{
    if (req.session.user) {
        return res.render("./user/usermain.ejs", {
            user: req.session.context
        });
	} else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
	} 
}

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

let getConciliator = (req, res) =>{
    if (req.session.conciliator) {
        return res.render("./conciliator/conciliatormain.ejs", {
            user: req.session.context
        });
	} else {
        return res.render("login.ejs", {
            errors: req.session.context
        });
	} 
}



let getLoginPage = (req, res) =>{
    if (req.session.user) {
        return res.render("./user/usermain.ejs", {
            user: req.session.context
        });
    }
    if (req.session.admin) {
        return res.render("./admin/adminmain.ejs", {
            user: req.session.context
        });
    }
    if (req.session.conciliator) {
        return res.render("./conciliator/conciliatormain.ejs", {
                ser: req.session.context
        });
    }
    return res.render("login.ejs", {
        errors: req.session.context
    });
};


let postLogOut = (req, res) => {
    req.session.destroy(function(err) {
        return res.redirect("/login");
    });
};

module.exports = {
    getLoginPage: getLoginPage,
    postLogOut: postLogOut,
    postLogin: postLogin,
    getUser: getUser,
    getAdmin: getAdmin,
    getConciliator: getConciliator
};