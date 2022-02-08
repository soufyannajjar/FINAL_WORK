const passport = require("passport");

module.exports = {
    checkAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            console.log('Your are not logged in')
            res.redirect("/login")
        }
    },
    checkCompany: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.isCompany === 1) {
                return next();
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    },
    checkViewer: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.isCompany === 0) {
                return next();
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    },
    checkAdmin: function (req, res, next) {
        if (req.isAuthenticated()) {
            if ((req.user.isCompany === 1) /*&& (req.user.email === "admin@emotify.com")*/ ) {
                console.log("PASSED");
                return next();
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    },
    redirectDashboard: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.isCompany === 0) {
                res.redirect("/viewer/dashboard");
            } else {
                res.redirect("/company/dashboard");
            }
        } else {
            res.redirect("/login");
        }
    }
};