/**Este fichero genera usuarios y los almacena en la base de datos.
 */

const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');
const SHA256 = require('crypto-js/sha256');

mongoose.connect('mongodb://localhost:27017/FilmEs_V3', { useNewUrlParser: true, useUnifiedTopology: true });

Usuario.collection.drop();

let usu1 = new Usuario({
    login: 'alexandra',
    password: SHA256('12345678')
});
usu1.save();

let usu2 = new Usuario({
    login: 'laura',
    password: SHA256('876543210')
});
usu2.save();