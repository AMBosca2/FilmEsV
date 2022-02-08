/** Este fichero hace la funcionalidad y controla las rutas del Login del usuario.
 * Renderiza la vista del inicio de sesión, y permite la funcionalidad de Login y Logout.
 */
const express = require('express');
const Usuario = require(__dirname + '/../models/usuario.js');
const router = express.Router();
const SHA256 = require('crypto-js/sha256');

router.get('/login', (req, res) => {
    res.render('auth_login');
});

router.post('/login', (req, res) => {
    Usuario.find({
            login: req.body.login,
            password: SHA256(req.body.password).toString()
        }).then(resultado => {
            if (resultado.length > 0) {
                req.session.login = resultado;
                res.redirect('/admin');
            } else {
                res.render('auth_login', { error: 'Usuario incorrecto' });
            }
        })
        .catch(error => {

            res.render('admin_error');
        });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
module.exports = router;