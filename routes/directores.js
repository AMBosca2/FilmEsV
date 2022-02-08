/** Este fichero hace la funcionalidad de las rutas de Directores en este caso y donde solo quien esté logeado podrá ver y modificar.
 * Usa métodos de inserción, borrado, búsqueda y modificación y además, renderiza las vistas del navegador. 
 */

const express = require('express');
const multer = require('multer');
const Director = require(__dirname + '/../models/director.js');
const router = express.Router();
const Auth = require(__dirname + '/../utils/auth.js');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})


let upload = multer({ storage: storage });

router.get('/', Auth, (req, res) => {
    Director.find().then(directores => {
        res.render('admin_directores', { directores: directores });
    });
});

router.get('/nuevo', Auth, (req, res) => {
    Director.find().then(directores => {
        res.render('admin_directores_form', { directores: directores });
    });
});

router.post('/nuevo', Auth, upload.single('perfil'), (req, res) => {

    if (typeof req.file === "undefined") {

        req.body.perfil = "director_default.jpg";

    } else {
        req.body.perfil = req.file.filename;
    }

    let nuevoDirector = new Director({

        perfil: req.body.perfil,
        nombre: req.body.nombre,
        nacimiento: req.body.nacimiento
    });

    nuevoDirector.save().then(resultado => {
        res.redirect(req.baseUrl);

    }).catch(error => {
        console.log(error);
        res.render('admin_error', { error: "Error añadiendo director" })
    });
});

router.get('/editar/:id', Auth, (req, res) => {
    Director.findById(req.params.id).then(director => {
        if (director) {
            res.render('admin_directores_form', { director: director });
        } else {
            res.render('admin_error', error = 'Error encontrando director');
        }

    }).catch(error => {
        res.render('admin_error');
    });
});

router.put('/editar/:id', Auth, upload.single('perfil'), (req, res) => {

    Director.findById(req.params.id).then(resultado => {
        if (typeof req.file === "undefined") {

            req.body.perfil = resultado.perfil;

        } else {

            req.body.perfil = req.file.filename;
        }

        Director.findByIdAndUpdate(req.params.id, {
            $set: {
                perfil: req.body.perfil,
                nombre: req.body.nombre,
                nacimiento: req.body.nacimiento
            }
        }, { new: true }).then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            console.log(error);
            res.render('admin_error', { error: "Error modificando director" });
        });
    });
});

router.delete('/borrar/:id', Auth, (req, res) => {
    Director.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.redirect('admin_error', { error: "error borrando director" });
    });
});

module.exports = router;