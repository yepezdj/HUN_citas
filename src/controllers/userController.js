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

module.exports = {
    getUser: getUser
}