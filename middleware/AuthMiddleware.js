const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();

const Authmiddleware = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.secret_key, (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/login');
                
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};

module.exports = {Authmiddleware};
