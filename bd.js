//Package mongoose
const mongoose = require('mongoose');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//Importamos modelo bd
var Informe = require('./src/models/informe_model.js');
var Instalacion = require('./src/models/instalacion_model.js');

//Connect to mongodb server and search co2meter database, if it does not exists then its created
mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

//Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

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
            console.log("ID placa: "+informe.id_placa+", CO2: "+informe.datos_co2);
        });
    }
});
app.get('/lista-informes', function(req, res){
    Informe.find(function(err, informes){
        if(err){
            console.log(err);
        }
        else{
            res.status(200).jsonp(informes);
        }
    });
});

app.get('/lista-instalaciones', function(req, res){
    Instalacion.find(function(err, instalaciones){
        if(err){
            console.log(err);
        }
        else{
            res.status(200).jsonp(instalaciones);
        }
    });
});

app.get('/lista-informes-placa/:id_placa', function(req, res){
    Informe.find({id_placa: req.params.id_placa}, function(err, informes){
        if(err){
            console.log(err);
        }
        else{
            res.status(200).jsonp(informes);
        }
    });
});

//Return informes with the nombre_poblacion specified in nombre_poblacion
app.get('/lista-informes-poblacion/:nombre_poblacion', function(req, res){
    Informe.find({nombre_poblacion: req.params.nombre_poblacion}, function(err, informes){
        if(err){
            console.log(err);
        }
        else{
            res.status(200).jsonp(informes);
        }
    });
});

//Inserts an informe
app.post('/nuevo-informe', function(req, res){
    const nuevo_informe = new Informe({
        id_placa: req.body.id_placa,
        nombre_instalacion: req.body.nombre_instalacion,
        nombre_poblacion: req.body.nombre_poblacion,
        coordenadas_latitud_placa: req.body.coordenadas_latitud_placa,
        coordenadas_longitud_placa: req.body.coordenadas_longitud_placa,
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

app.post('/nueva-instalacion', function(req, res) {
    const nueva_instalacion = new Instalacion({
        id_placa: req.body.id_placa,
        nombre_instalacion: req.body.nombre_instalacion,
        coordenadas_latitud_placa: req.body.coordenadas_latitud_placa,
        coordenadas_longitud_placa: req.body.coordenadas_longitud_placa
    });
    nueva_instalacion.save(function(err, nueva_instalacion){
        if(err) console.log(err);
        else res.send("Nueva instalacion insertada correctamente");
    });
});

app.get('/elimina-informes-placa/:id_placa', function(req, res){
    Informe.deleteMany({id_placa: req.params.id_placa}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han eliminado todos los informes de la placa "+req.params.id_placa);
        }
    });
});

app.post('/elimina-informes-placa', function(req, res){
    Informe.deleteMany({id_placa: req.body.id_placa}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han eliminado todos los informes de la placa"+req.body.id_placa);
        }
    });
});

app.get('/elimina-instalacion/:id_placa', function(req, res){
    Informe.deleteMany({id_placa: req.params.id_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    Instalacion.deleteMany({id_placa: req.params.id_placa}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han eliminado todas las instalaciones y sus informes correctamente de la placa con id: "+req.params.id_placa);
        }
    });
});

app.post('/elimina-instalacion', function(req, res){
    Informe.deleteMany({id_placa: req.body.id_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    Instalacion.deleteMany({id_placa: req.body.id_placa}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han eliminado todas las instalaciones y sus informes correctamente de la placa con id: "+req.body.id_placa);
        }
    });
});

app.get('/actualiza-nombre-placa/:id_placa/:nombre_instalacion', function(req, res){
    Informe.updateMany({id_placa: req.params.id_placa}, {nombre_instalacion: req.params.nombre_instalacion}, function(err){
        if(err){
            console.log(err);
        }
    });
    Instalacion.updateMany({id_placa: req.params.id_placa}, {nombre_instalacion: req.params.nombre_instalacion}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han actualizado los nombres de instalación de todos los informes de la placa "+req.params.id_placa);
        }
    });
});

app.post('/actualiza-nombre-placa', function(req, res){
    Informe.updateMany({id_placa: req.body.id_placa}, {nombre_instalacion: req.body.nombre_instalacion}, function(err){
        if(err){
            console.log(err);
        }
    });
    Instalacion.updateMany({id_placa: req.body.id_placa}, {nombre_instalacion: req.body.nombre_instalacion}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han actualizado los nombres de instalación de todos los informes de la placa "+req.body.id_placa);
        }
    });
});

app.get('/actualiza-nombre-instalacion/:id_placa/:nombre_instalacion', function(req, res){
    Instalacion.updateMany({id_placa: req.params.id_placa}, {nombre_instalacion: req.params.nombre_instalacion}, function(err){
        if(err){
            console.log(err);
        }
    });
    Informe.updateMany({id_placa: req.params.id_placa}, {nombre_instalacion: req.params.nombre_instalacion}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han actualizado los nombres de instalación de todos los informes de la placa "+req.params.id_placa);
        }
    });
});

app.post('/actualiza-nombre-instalacion', function(req, res){
    Instalacion.updateMany({id_placa: req.body.id_placa}, {nombre_instalacion: req.body.nombre_instalacion}, function(err){
        if(err){
            console.log(err);
        }
    });
    Informe.updateMany({id_placa: req.body.id_placa}, {nombre_instalacion: req.body.nombre_instalacion}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("Se han actualizado los nombres de instalación de todos los informes de la placa "+req.body.id_placa);
        }
    });
});

app.get('/actualiza-coordenadas-placa/:id_placa/:coordenadas_latitud_placa/:coordenadas_longitud_placa', function(req, res){
    //Update coordenadas_latitud_placa
    Informe.updateMany({id_placa: req.params.id_placa}, {coordenadas_latitud_placa: req.params.coordenadas_latitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    //Update coordenadas_longitud_placa
    Informe.updateMany({id_placa: req.params.id_placa}, {coordenadas_longitud_placa: req.params.coordenadas_longitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    res.send("Se han actualizado las coordenadas de todos los informes de la placa "+req.params.id_placa);
});

app.post('/actualiza-coordenadas-placa', function(req, res){
    //Update coordenadas_latitud_placa
    Informe.updateMany({id_placa: req.body.id_placa}, {coordenadas_latitud_placa: req.body.coordenadas_latitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    //Update coordenadas_longitud_placa
    Informe.updateMany({id_placa: req.body.id_placa}, {coordenadas_longitud_placa: req.body.coordenadas_longitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    res.send("Se han actualizado las coordenadas de todos los informes de la placa "+req.body.id_placa);
});

app.get('/actualiza-coordenadas-instalacion/:id_placa/:coordenadas_latitud_placa/:coordenadas_longitud_placa', function(req, res){
    //Update coordenadas_latitud_placa
    Instalacion.updateMany({id_placa: req.params.id_placa}, {coordenadas_latitud_placa: req.params.coordenadas_latitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    //Update coordenadas_longitud_placa
    Instalacion.updateMany({id_placa: req.params.id_placa}, {coordenadas_longitud_placa: req.params.coordenadas_longitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    res.send("Se han actualizado las coordenadas de la instalacion con id: "+req.params.id_placa);
});

app.post('/actualiza-coordenadas-instalacion', function(req, res){
    //Update coordenadas_latitud_placa
    Instalacion.updateMany({id_placa: req.body.id_placa}, {coordenadas_latitud_placa: req.body.coordenadas_latitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    //Update coordenadas_longitud_placa
    Instalacion.updateMany({id_placa: req.body.id_placa}, {coordenadas_longitud_placa: req.body.coordenadas_longitud_placa}, function(err){
        if(err){
            console.log(err);
        }
    });
    res.send("Se han actualizado las coordenadas de la instalacion con id: "+req.body.id_placa);
});

app.listen(2011, function () {
     console.log("Base de datos funcionando por el pùerto http://localhost:2011");
});
