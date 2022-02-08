/** Este fichero crea los esquemas de las plataformas
 */
const mongoose = require('mongoose');

let plataformaSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        minlength: 2
    },
    fecha: {
        type: Date
    },
    cantidad: {
        type: Boolean,
        default: false
    }
});

let Plataforma = mongoose.model('plataforma', plataformaSchema);
module.exports = Plataforma;