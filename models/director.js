/** Este fichero crea los esquemas de los Directores
 */

const mongoose = require('mongoose');

let directorSchema = new mongoose.Schema({

    perfil: {
        type: String
    },
    nombre: {
        type: String,
        required: true,
        minlength: 5
    },
    nacimiento: {
        type: Number
    }
});

let Director = mongoose.model('director', directorSchema);
module.exports = Director;