/** Este fichero hace la funcionalidad y controla las rutas de plataformas en este caso y donde solo quien esté logeado podrá ver y modificar.
 * Usa métodos de inserción, borrado y modificación y además, renderiza las vistas del navegador.
 */

const express = require('express');
const Plataforma = require(__dirname + '/../models/plataforma.js');
const router = express.Router();
const Auth = require(__dirname + '/../utils/auth.js');


router.get('/', Auth, (req, res) => {
    Plataforma.find().then(plataformas => {
        res.render('admin_plataformas', { plataformas: plataformas });
    });
});

router.get('/nueva', Auth, (req, res) => {
    Plataforma.find().then(plataformas => {
        res.render('admin_plataformas_form', { plataformas: plataformas });
    });
});

router.post('/nueva', Auth, (req, res) => {

    let cant = false;

    if (typeof req.body.cantidad === "undefined") {
        cant = false;

    } else {
        cant = true;
    }

    let nuevaPlataforma = new Plataforma({

        nombre: req.body.nombre,
        fecha: req.body.fecha,
        cantidad: cant
    });

    nuevaPlataforma.save().then(resultado => {
        res.redirect(req.baseUrl);

    }).catch(error => {
        console.log(error);
        res.render('admin_error', { error: "Error añadiendo plataforma" })
    });
});

router.get('/editar/:id', Auth, (req, res) => {
    Plataforma.findById(req.params.id).then(plataforma => {
        if (plataforma) {
            res.render('admin_plataformas_form', { plataforma: plataforma });
        } else {
            res.render('admin_error', error = 'Error encontrando plataforma');
        }

    }).catch(error => {
        res.render('admin_error');
    });
});


router.put('/editar/:id', Auth, (req, res) => {

    let cant = false;

    if (typeof req.body.cantidad === "undefined") {
        cant = false;

    } else {
        cant = true;
    }

    Plataforma.findByIdAndUpdate(req.params.id, {
        $set: {
            nombre: req.body.nombre,
            fecha: req.body.fecha,
            cantidad: cant
        }
    }, { new: true }).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        console.log(error);
        res.render('admin_error', { error: "Error modificando plataforma" });
    });
});

router.delete('/borrar/:id', Auth, (req, res) => {
    Plataforma.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.redirect('admin_error', { error: "error borrando plataforma" });
    });
});

module.exports = router;