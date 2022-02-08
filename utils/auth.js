/**Este fichero permite saber a la página si el usuario está logueado o no,
 * Se le llama en las rutas para que haga su función donde le indiquemos.
 */

let authentication = (req, res, next) => {
    if (req.session && req.session.login)
        return next();
    else {
        res.render('auth_login');
    }
};

module.exports = authentication;