/** Este fichero crea los esquemas de las Películas.
 */

const mongoose = require('mongoose');
const genero = require('../utils/generos');

let peliculaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    sinopsi: {
        type: String,
        required: true,
        minlength: 10,
        trim: true
    },

    duracion: {
        type: Number,
        required: true,
        min: 0,
        trim: true
    },
    genero: {
        type: String,
        required: true,
        trim: true,
        enum: genero
    },
    imagen: {
        type: String
    },

    valoracion: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },

    plataforma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plataforma'
    },

    director: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'director'
    }
});

let Pelicula = mongoose.model('pelicula', peliculaSchema);

module.exports = Pelicula