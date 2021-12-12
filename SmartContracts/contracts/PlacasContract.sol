// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract PlacasContract {

    string hash_bd;
    uint id_placa;
    uint datos_co2;
    address creador;

    constructor(uint _id_placa, uint _datos_co2, string memory _hash_bd) public{
        creador = msg.sender;
        id_placa = _id_placa;
        datos_co2 = _datos_co2;
        hash_bd = _hash_bd;
    }
    
    modifier soloCreador(){
        require(msg.sender == creador);
        _;
    }
    
     function set_datos(uint _datos_co2, string memory _hash_bd) public soloCreador {
        datos_co2 = _datos_co2;
        hash_bd = _hash_bd;
    }
    
    function getIdPlaca() public view returns (uint) {
        return id_placa;
    }
    
    function getHashBd() public view returns (string memory) {
        return hash_bd;
    }
    
     function getDatosCo2() public view returns (uint) {
        return datos_co2;
    }

}
