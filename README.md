# CO2METER
CO2METER en un servicio que pone a disposición pública los datos
de contaminación recogidos por distintos dispositivos. Consta de una API de
comunicación, API de control de la base de datos, una web y código de los
dispositivos enviadores de datos.

## Autores
***
* [Carlos Gustavo Vergara Gamboa](https://github.com/Gustavove/)
* [Isis Rodríguez González](https://github.com/isisrg)
* [Marc Fernández Palau](https://github.com/marcfpalau)
* [Jabar Latif Martínez](https://github.com/sel21)

## Arquitectura
***

![Arquitectura](https://raw.githubusercontent.com/Gustavove/CO2METER/ef0a1330f906f2229be5159d008b3aa866762e47/arquitectura.png)

## Tecnolgías
***
* [Node.js](https://nodejs.org/): Versión 10.19.0
* [npm.js](https://www.npmjs.com/): Versión 6.14.4
* [Mongodb](https://www.mongodb.com/): Versión 4.4.10
* [Truffle Suite](https://trufflesuite.com/) Versión 5.4.23

## Instalación
***

### Servidor
Instalación nodejs y npm
```bash
sudo apt install nodejs
```
Instalación mongodb e inicalización

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update
sudo apt install mongodb-org
sudo systemctl start mongod.service
sudo systemctl status mongod
```

Instalación Truffle Suite

```bash
npm install -g truffle
```

## Inicialización 
***
#### Servidor

En Server

```bash
npm install
npm run start
```
###### Si aparece  ReferenceError: TextEncoder is not defined
```bash
nano node_modules/whatwg-url/lib/encoding.js
```
Añadir 
```javascript
const {TextDecoder, TextEncoder} = require("util");
```


#### Contratos
En SmartContracts/contracts
```bash
truffle compile
truffle migrate
```
Los contratos pueden ser probados en Ganache
