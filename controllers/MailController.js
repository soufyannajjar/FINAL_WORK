let nodemailer = require("nodemailer");


exports.sendContactMail = async function (req, res, next) {
    try {
        let {
            name,
            email,
            message
        } = req.body;
        let mailTransporter = nodemailer.createTransport({
            host: "mail470.sohosted.com",
            port: 465,
            secure: true,
            auth: {
                user: "github@socupmedia.be",
                pass: "Eindwerk_123",
            },
        });

        let info = await mailTransporter.sendMail({
            from: '"Emotify" <github@socupmedia.be>',
            to: "github@socupmedia.be",
            subject: "NEW MESSAGE - EMOTIFY",
            text: message,
            html: `
       <b>New Message from Emotify: </b> <h1>${name}</h1> <h2>${email}</h2><p> ${message}</p>`,
        }).then((status) => {
            console.log(status);
            req.flash('success_msg', 'Message sended !');
            res.redirect('/#contact');
        });


    } catch (err) {
        console.error(err.message);
    }

}

exports.sendResetPassword = async function (resetCode, toEmail) {
    resetCode = resetCode.toString();
    try {
        let mailTransporter = nodemailer.createTransport({
            host: "mail470.sohosted.com",
            port: 465,
            secure: true,
            auth: {
                user: "github@socupmedia.be",
                pass: "Eindwerk_123",
            },
        });

        await mailTransporter.sendMail({
            from: '"Emotify" <github@socupmedia.be>',
            to: toEmail,
            subject: "PASSWORD RESET - EMOTIFY",
            text: resetCode,
            html: `
       <p>Your password reset key is:  ${resetCode}</p>`,
        }).then((status) => {
            console.log(status);
        });


    } catch (err) {
        console.error(err.message);
    }

}