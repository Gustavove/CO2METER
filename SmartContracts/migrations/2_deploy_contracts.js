var placa = artifacts.require("PlacasContract");

module.exports = function(deployer) {

  //Crear contrato por cad nueva placa registrada
  var id_placa = 222276543;
  var datos_co2 = 12345;
  var hash = 'e000e3344445f445678u5676543t4567';
  
  deployer.deploy(placa, id_placa, datos_co2, hash);
};
