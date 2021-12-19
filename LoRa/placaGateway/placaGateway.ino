//Libreria LoRa
#include <LoRa.h>

//Pines LoRa
#define SCK 5
#define MISO 19
#define MOSI 27
#define SS 18
#define RST 14 //npi
#define DIO0 26

//LoRa BAND (886E6 Europa)
#define BAND 866E6

//Librerias para la comunicacion HTTP
#include "HTTPClient.h"
#include "WiFi.h"

//Data structure libraries
#include <pseudostack.h>

String LoRaData;
WiFiClient client;

//Parametros WiFi 
const char* ssid = "MarcAP";
const char* password =  "cueu6904";

void setup() { 
  //Inicializamos Serial
  Serial.begin(115200);
  Serial.println("Gateway LoRa CO2meter");
  
  //SPI LoRa pins
  SPI.begin(SCK, MISO, MOSI, SS);
  //setup LoRa transceiver module
  LoRa.setPins(SS, RST, DIO0);

  if (!LoRa.begin(BAND)) {
    Serial.println("No se ha podido iniciar LoRa");
    while (1);
  }
  Serial.println("He iniciado LoRa!");

  //conexion access point WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Me estoy conectando a WiFi");
    delay(1000);
  }
  Serial.println("Contectado a WiFi!");
  delay(1000);
}

void sendToServer(String LoRaData) {
  const char * message = LoRaData.c_str();  
  String mid ="";
  String id = "";
  String sensor = "";
  String sats = "";
  String lt = "";
  String lg = "";

  int i = 0;
  
  while (message[i] != 'd') {
    mid += message[i];
    ++i;
  }

  ++i;

  while (message[i] != 'd') {
    id += message[i];
    ++i;
  }
  ++i;

  while (message[i] != 'd') {
    sensor += message[i];
    ++i;
  }
  ++i;

  while (message[i] != 'd') {
    sats += message[i];
    ++i; 
  }
  ++i;

  while (message[i] != 'd') {
    lt += message[i];
    ++i; 
  }
  ++i;

  while (i < strlen(message)) {
    lg += message[i];
    ++i;
  }
  if (sats == "0") { 
    HTTPClient http;
    http.begin("http://46.101.50.162:8000/api");
    http.addHeader("User-Agent", "CO2METER/1.0", true, true);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded", false, true);
    int res = http.POST("idplaca=" +id+"&particulasCO2="+sensor+"&latitud="+lt+"&longitud="+lg);
    if (res == -1) Serial.println("He intentado enviar el mensaje al servidor, pero he recibido error -1. Parece que el servidor está desconectado o no responde");
    else {
      Serial.print("He enviado el mensaje al servidor, y me ha devuelto un código HTTP ");
      Serial.println(res);
    }
    http.end();
  } else Serial.println("No he enviado el mensaje, ya que contenía una latitud y longitud incorrectas.");
  push(atoi(mid.c_str()));
}

void loop() {
  //try to parse packet
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    //read packet
    while (LoRa.available()) {
      LoRaData = LoRa.readString();
    }
    if (!exists(atoi(LoRaData.c_str()))) {
      Serial.print("He recibido este mensaje: ");
      Serial.print(LoRaData);
      Serial.println(". Procedo a enviarlo al servidor");
      sendToServer(LoRaData);
    }
    else {
      Serial.print("He recibido este mensaje: ");
      Serial.print(LoRaData);
      Serial.println(". Pero ya lo he enviado al servidor, así que no lo voy a hacer otra vez");
    }
  }
}
