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

module.exports = {
    getConciliator: getConciliator
}