/** Este fichero hace la funcionalidad y controla las rutas públicas que todos los usuarios pueden ver.
 * Renderiza las vistas del navegador y permite búsqueda de peliculas.
 */

const express = require('express');
const Pelicula = require(__dirname + '/../models/pelicula.js');
const Director = require(__dirname + '/../models/director.js');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('public_index');
});

router.get('/buscar', (req, res) => {

    let listaPelicula = [];

    if (req.query.buscar.length > 0) {
        Pelicula.find({}).then(resultado => {
                resultado.forEach(pelicula => {
                    if (pelicula.titulo.toLowerCase().includes(req.query.buscar.toLowerCase())) {
                        listaPelicula.push(pelicula);
                    }
                });
                if (listaPelicula.length > 0) {
                    res.render('public_index', { peliculas: listaPelicula })
                } else {
                    res.render('public_error', { error: 'No se han encontrado películas' });
                }
            })
            .catch(error => {
                res.render('public_error');
            });
    } else {
        res.redirect('/');
    }
});

router.get('/pelicula/:id', (req, res) => {
    Pelicula.findById(req.params.id).populate('director').populate('plataforma').then(resultado => {
        if (resultado) {
            res.render('public_pelicula', { pelicula: resultado });
        } else {
            res.render('public_error', { error: 'No se ha encontrado la pelicula solicitada' });
        }
    }).catch(error => {
        res.render('public_error');
    });
});

router.get('/director/:id', (req, res) => {
    Director.findById(req.params.id).then(resultado => {
        if (resultado) {
            res.render('public_director', { director: resultado });
        } else {
            res.render('public_error', { error: 'No existe director' });
        }
    }).catch(error => {
        res.render('public_error');
    });
});

module.exports = router;