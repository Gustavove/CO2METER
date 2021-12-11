var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema of the data we are going to save in our database
const informeSchema = new mongoose.Schema({
    id_placa: {
        type: Number,
        min: [0, 'El id de la placa tiene que ser mayor o igual a 0'],
        required: [true, 'Id no especificado']
    },
    nombre_instalacion: {
        type: String,
        required: [true, 'Nombre de la localizacion no especificado']
    },
    nombre_poblacion: {
        type: String,
        required: [true, 'Nombre de la poblacion no especificado']
    },
    coordenadas_latitud_placa: {
        type: Number,
        required: [true, 'Latitud de coordenadas no especificada']
    },
    coordenadas_longitud_placa: {
        type: Number,
        required: [true, 'Longitud de coordenadas no especificada']
    },
    datos_co2: {
        type: Number,
        required: [true, 'Datos de contaminacion no especificados']
    },
    fecha_transaccion: {
        type: String,
        required: [true, 'Fecha de transaccion no especificada']
    },
    hora_transaccion: {
        type: String,
        required: [true, 'Hora de transaccion no especificada']
    },
    hash_transaccion: {
        type: String,
        required: [true, 'Hora de transaccion no especificada']
    }
});

//Create a mongoose model that will contain all the informeSchema created
module.exports = mongoose.model("Informe", informeSchema);