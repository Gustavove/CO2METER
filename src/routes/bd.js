//Package mongoose
const mongoose = require('mongoose'),
    express = require('express'),
    app = express(),
    methodOverride = require('method-override');

//Connect to mongodb server and search co2meter database, if it does not exists then its created
mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

//Creamos variable route (funciona igual que app)
const router = express.Router();

//Middlewares
router.use(express.urlencoded({extended: false }));
router.use(express.json());
router.use(methodOverride());
// router.use(express.json());
//router.use(express.static("public"));

//Schema of the data we are going to save in our database
const informeSchema = new mongoose.Schema({
    id_placa: {
        type: Number,
        min: [0, 'El id de la placa tiene que ser mayor o igual a 0'],
        required: [true, 'Id no especificado']
    },
    hash_certificado: {
        type: String,
        required: [true, 'Hash del certificado no especificado']
    },
    nombre_localizacion: {
        type: String,
        required: [true, 'Nombre de la localizacion no especificado']
    },
    nombre_poblacion: {
        type: String,
        required: [true, 'Nombre de la poblacion no especificado']
    },
    coordenadas_longitud_placa: {
        type: Number,
        required: [true, 'Longitud de coordenadas no especificada']
    },
    coordenadas_latitud_placa: {
        type: Number,
        required: [true, 'Latitud de coordenadas no especificada']
    },
    datos_co2: {
        type: Number,
        required: [true, 'Datos de contaminacion no especificados']
    },
    fecha_transaccion: {
        type: Number,
        required: [true, 'Fecha de transaccion no especificada']
    },
    hora_transaccion: {
        type: Number,
        required: [true, 'Hora de transaccion no especificada']
    },
    hash_transaccion: {
        type: String,
        required: [true, 'Hora de transaccion no especificada']
    }
});

//Create a mongoose model that will contain all the informeSchema created
const Informe = mongoose.model("Informe", informeSchema);

//Example for testing
// app.get('/', function (req, res) {
//     res.send("Hello World!");
// });

//Return all informes of the DB
Informe.find(function(err, informes){
    if(err){
        console.log(err);
    }
    else{
        console.log("Lista de todos los informes:");
        informes.forEach(function(informe){
            console.log(informe.datos_co2);
        });
    }
});
app.get('/bbdd/lista-informes', function(req, res){
    Informe.find(function(err, informes){
        if(err){
            console.log(err);
        }
        else{
            res.status(200).jsonp(informes);
        }
    });
});
router.post('/bbdd/lista-informes', function(req, res){
    Informe.find(function(err, informes){
        if(err){
            console.log(err);
        }
        else{
            res.status(200).jsonp(informes);
        }
    });
});

//Return informes with a id_placa equal to the given placa_id
Informe.find({id_placa: 111}, function(err, informes){
    if(err){
        console.log(err);
    }
    else{
        console.log("Informes de la placa con id 111:");
        informes.forEach(function(informe){
            console.log(informe.datos_co2);
        });
    }
});
router.get('/lista-informes-placa/:id_placa', function(req, res){
    Informe.find({id_placa: req.params.id_placa}, function(err, informes){
        if(err){
            console.log(err);
        }
        else{
            res.status(200).jsonp(informes);
        }
    });
});
router.post('/lista-informes-placa', function(req, res){
    Informe.find({id_placa: req.body.id_placa}, function(err, informes){
        if(err){
            console.log(err);
        }
        else{
            res.status(200).jsonp(informes);
        }
    });
});

//Return informes with the nombre_poblacion specified in nombre_poblacion
router.get('/lista-informes-poblacion/:nombre_poblacion', function(req, res){
    Informe.find({nombre_poblacion: req.params.nombre_poblacion}, function(err, informes){
        if(err){
            console.log(err);
        }
        else{
            res.status(200).jsonp(informes);
        }
    });
});
router.post('/lista-informes-poblacion', function(req, res){
    Informe.find({nombre_poblacion: req.body.nombre_poblacion}, function(err, informes){
        if(err){
            console.log(err);
        }
        else{
            res.status(200).jsonp(informes);
        }
    });
});

//Inserts an informe
router.post('/nuevo-informe', function(req, res){
    const nuevo_informe = new Informe({
        id_placa: req.body.id_placa,
        hash_certificado: req.body.hash_certificado,
        nombre_localizacion: req.body.nombre_localizacion,
        nombre_poblacion: req.body.nombre_poblacion,
        coordenadas_longitud_placa: req.body.coordenadas_longitud_placa,
        coordenadas_latitud_placa: req.body.coordenadas_latitud_placa,
        datos_co2: req.body.datos_co2,
        fecha_transaccion: req.body.fecha_transaccion,
        hora_transaccion: req.body.hora_transaccion,
        hash_transaccion: req.body.hash_transaccion
    });
    //Buscar informe con mismo id_placa, coordenadas_longitud_placa, coordenadas_latitud_placa, datos_co2 si existe no insertar
    nuevo_informe.save(function(err, nuevo_informe){
        if(err){
            console.log(err);
        }
        else{
            res.send("Nuevo informe insertado correctamente");
        }
    });
});

//DELETE - Delete all the informes with the specific id_placa equal to the given placa_id
// var cuantos = 0;
// Informe.find({id_placa: 333}, function(err, informes){
//     if(err){
//         console.log(err);
//     }
//     else{
//         cuantos = informes.length;
//         console.log(cuantos);
//         if(informes.length == 0){
//             console.log("No hay informes asociados a esta placa");
//         }
//         else{
//             if(informes.length == 1){
//                 console.log("Se va a eliminar 1 informe.");
//             }
//             else{
//                 console.log("Se van a eliminar "+informes.length+" informes.");
//             }
//             Informe.deleteMany({id_placa: 333}, function(err){
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     if(cuantos == 1){
//                         console.log("Se ha eliminado 1 informe correctamente.");
//                     }
//                     else{
//                         console.log("Se han eliminado "+cuantos+" informes correctamente.");
//                     }
//                 }
//             });
//         }
//     }
// });
router.get('/elimina-informes-placa/:id_placa', function(req, res){
    Informe.deleteMany({id_placa: req.params.id_placa}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han eliminado todos los informes de la placa "+req.params.id_placa);
        }
    });
});
router.post('/elimina-informes-placa', function(req, res){
    Informe.deleteMany({id_placa: req.body.id_placa}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han eliminado todos los informes de la placa "+req.body.id_placa);
        }
    });
});

//UPDATE - Channges the nombre_localizacion of all the informes with a id_placa equal to the given id_placa
// var cuantos = 0;
// Informe.find({id_placa: 111}, function(err, informes){
//     if(err){
//         console.log(err);
//     }
//     else{
//         cuantos = informes.length;
//         if(informes.length == 0){
//             console.log("No hay informes asociados a esta placa");
//         }
//         else{
//             if(informes.length == 1){
//                 console.log("Se va a modificar 1 informe.");
//             }
//             else{
//                 console.log("Se van a modificar "+informes.length+" informes.");
//             }
//             Informe.updateMany({id_placa: 111}, {nombre_localizacion: "primera-placa"}, function(err){
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     if(cuantos == 1){
//                         console.log("Se ha modificado el nombre de 1 informe correctamente.");
//                     }
//                     else{
//                         console.log("Se ha modificado el nombre de "+cuantos+" informes correctamente.");
//                     }
//                 }
//             });
//         }
//     }
// });
router.get('/actualiza-nombre-placa/:id_placa/:nombre_localizacion', function(req, res){
    Informe.updateMany({id_placa: req.params.id_placa}, {nombre_localizacion: req.params.nombre_localizacion}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han actualizado los nombres de localizacion de todos los informes de la placa "+req.params.id_placa);
        }
    });
});
router.post('/actualiza-nombre-placa', function(req, res){
    Informe.updateMany({id_placa: req.body.id_placa}, {nombre_localizacion: req.body.nombre_localizacion}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han actualizado los nombres de localizacion de todos los informes de la placa "+req.body.id_placa);
        }
    });
});

//UPDATE - Channges the coordenadas_longitud_placa and the coordenadas_latitud_placa of all the informes with a id_placa equal to the given id_placa
// var cuantos = 0;
// Informe.find({id_placa: 111}, function(err, informes){
//     if(err){
//         console.log(err);
//     }
//     else{
//         cuantos = informes.length;
//         if(informes.length == 0){
//             console.log("No hay informes asociados a esta placa");
//         }
//         else{
//             if(informes.length == 1){
//                 console.log("Se va a modificar 1 informe.");
//             }
//             else{
//                 console.log("Se van a modificar "+informes.length+" informes.");
//             }
//             //Update coordenadas_longitud_placa
//             Informe.updateMany({id_placa: 111}, {coordenadas_longitud_placa: 1100}, function(err){
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     if(cuantos == 1){
//                         console.log("Se ha modificado la coordenada longitud de 1 informe correctamente.");
//                     }
//                     else{
//                         console.log("Se ha modificado las coordenadas longitud de "+cuantos+" informes correctamente.");
//                     }
//                 }
//             });
//             //Update coordenadas_latitud_placa
//             Informe.updateMany({id_placa: 111}, {coordenadas_latitud_placa: 1111}, function(err){
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     if(cuantos == 1){
//                         console.log("Se ha modificado la coordenada latitud de 1 informe correctamente.");
//                     }
//                     else{
//                         console.log("Se ha modificado las coordenadas latitud de "+cuantos+" informes correctamente.");
//                     }
//                 }
//             });
//         }
//     }
// });
router.get('/actualiza-coordenadas-placa/:id_placa/:coordenadas_longitud_placa/:coordenadas_latitud_placa', function(req, res){
    //Update coordenadas_longitud_placa
    Informe.updateMany({id_placa: req.params.id_placa}, {coordenadas_longitud_placa: req.params.coordenadas_longitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    //Update coordenadas_latitud_placa
    Informe.updateMany({id_placa: req.params.id_placa}, {coordenadas_latitud_placa: req.params.coordenadas_latitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    res.send("Se han actualizado las coordenadas de todos los informes de la placa "+req.params.id_placa);
});
router.post('/actualiza-coordenadas-placa', function(req, res){
    //Update coordenadas_longitud_placa
    Informe.updateMany({id_placa: req.body.id_placa}, {coordenadas_longitud_placa: req.body.coordenadas_longitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    //Update coordenadas_latitud_placa
    Informe.updateMany({id_placa: req.body.id_placa}, {coordenadas_latitud_placa: req.body.coordenadas_latitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    res.send("Se han actualizado las coordenadas de todos los informes de la placa "+req.body.id_placa);
});

/*
router.listen(2011, function () {
    console.log("Node server running on http://localhost:2011");
});
*/


//Modulo disponible
module.exports = router;