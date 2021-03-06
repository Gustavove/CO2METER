var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema of the data we are going to save in our database
const instalacionSchema = new mongoose.Schema({
    id_placa: {
        type: Number,
        min: [0, 'El id de la placa tiene que ser mayor o igual a 0'],
        required: [true, 'Id no especificado'],
        unique: true
    },
    nombre_instalacion: {
        type: String,
        required: [true, 'Nombre de la localizacion no especificado']
    },
    coordenadas_latitud_placa: {
        type: Number,
        required: [true, 'Latitud de coordenadas no especificada']
    },
    coordenadas_longitud_placa: {
        type: Number,
        required: [true, 'Longitud de coordenadas no especificada']
    }
});

//Create a mongoose model that will contain all the instalacionSchema created
module.exports = mongoose.model("Instalacion", instalacionSchema);