/** Este fichero hace la funcionalidad y controla las rutas de Películas en este caso y donde solo quien esté logeado podrá ver y modificar.
 * Usa métodos de inserción, borrado y modificación y además, renderiza las vistas del navegador.
 */

const express = require('express');
const multer = require('multer');
const Pelicula = require(__dirname + '/../models/pelicula.js');
const Plataforma = require(__dirname + '/../models/plataforma.js');
const Auth = require(__dirname + '/../utils/auth.js');
const Director = require(__dirname + '/../models/director');
const router = express.Router();
const genero = require('../utils/generos');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
});

let upload = multer({ storage: storage });

router.get('/', Auth, (req, res) => {
    Pelicula.find().then(resultado => {
        res.render('admin_peliculas', { peliculas: resultado });
    }).catch(error => {
        res.render('admin_error');
    });
});

router.get('/peliculas/nueva', Auth, (req, res) => {
    Director.find().then(directores => {
        Plataforma.find().then(plataformas => {
            res.render('admin_peliculas_form', { directores: directores, plataformas: plataformas, generos: genero });
        });
    });
});

//METODOS POST
router.post('/peliculas', Auth, upload.single('imagen'), (req, res) => {

    if (typeof req.file === "undefined") {

        req.body.imagen = "film_default.jpg";

    } else {

        req.body.imagen = req.file.filename;
    }

    let nuevaPelicula = new Pelicula({
        titulo: req.body.titulo,
        sinopsi: req.body.sinopsi,
        duracion: req.body.duracion,
        genero: req.body.genero,
        imagen: req.body.imagen,
        valoracion: req.body.valoracion,
        plataforma: req.body.plataforma,
        director: req.body.director,
    });

    nuevaPelicula.save().then(resultado => {
        res.redirect(req.baseUrl);

    }).catch(error => {
        res.render('admin_error', { error: "Error añadiendo pelicula" })
    });

});

router.get('/peliculas/:id', Auth, (req, res) => {
    Pelicula.findById(req.params.id).populate('director').populate('plataforma').then(resultado => {
        Director.find().then(directores => {
            Plataforma.find().then(plataformas => {
                if (resultado) {
                    res.render('admin_peliculas_form', { pelicula: resultado, directores: directores, plataformas: plataformas, generos: genero });
                } else {
                    res.render('admin_error', error = 'Error encontrando película');
                }
            });
        });
    }).catch(error => {
        res.render('admin_error');
    });
});


//MODIFICAR
router.put('/peliculas/:id', Auth, upload.single('imagen'), (req, res) => {

    Pelicula.findById(req.params.id).then(resultado => {
        if (typeof req.file === "undefined") {

            req.body.imagen = resultado.imagen;

        } else {

            req.body.imagen = req.file.filename;
        }

        Pelicula.findByIdAndUpdate(req.params.id, {
            $set: {
                titulo: req.body.titulo,
                sinopsi: req.body.sinopsi,
                duracion: req.body.duracion,
                genero: req.body.genero,
                imagen: req.body.imagen,
                valoracion: req.body.valoracion,
                plataforma: req.body.plataforma,
                director: req.body.director,
            }
        }, { new: true }).then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            console.log(error);
            res.render('admin_error', { error: "Error modificando pelicula" });
        });
    });
});

//METODO DELETE
router.delete('/peliculas/:id', Auth, (req, res) => {
    Pelicula.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.redirect('admin_error', { error: "error borrando pelicula" });
    });
});

module.exports = router;