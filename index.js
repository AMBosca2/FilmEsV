/**Fichero raíz del proyecto.
 * Aquí se llaman distintos módulos para usarlos, las rutas y la
 * puesta en marcha del servidor.
 */

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

let app = express();

mongoose.connect('mongodb://localhost:27017/FilmEs_V3', { useNewUrlParser: true, useUnifiedTopology: true });

const auth = require(__dirname + '/routes/auth');
const public = require(__dirname + '/routes/public');
const peliculas = require(__dirname + '/routes/peliculas');
const plataformas = require(__dirname + '/routes/plataformas');
const directores = require(__dirname + '/routes/directores');

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'njk');

app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride(function(req, res) {

    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(methodOverride('_method'));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/', public)
app.use('/auth', auth);
app.use('/admin', peliculas);
app.use('/admin/plataforma', plataformas);
app.use('/admin/director', directores);
app.use('/public', express.static(__dirname + '/public'));

app.listen(8080);