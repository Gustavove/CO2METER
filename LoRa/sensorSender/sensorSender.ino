//Library for GPS
#include <TinyGPS++.h>
#include <axp20x.h>

//Libraries for LoRa
#include <SPI.h>
#include <LoRa.h>

//Data structure libraries
#include <pseudostack.h>

//Libraries for timing
#include <time.h>


//define the pins used by the LoRa transceiver module
#define SCK 5
#define MISO 19
#define MOSI 27
#define SS 18
#define RST 23 //npi
#define DIO0 26

//define LoRa band (866E6 for Europe)
#define BAND 866E6

//Identificador de la placa random generated (16 char)
String board_id2 = "5838593688546342";
String board_id = "2412791256378925";
//Valor de datos del sensor
int sensorValue;
//const int GPIO = 02;
TinyGPSPlus gps;
HardwareSerial GPS(1);
AXP20X_Class axp;

//packet counter
int counter = 0;
int SN = 3;
String LoRaData;
int identifier = 0;
int pasttime = 0;



void setup() {
  //initialize Serial Monitor
  Serial.begin(115200);
  Serial.println("CO2METER Sender node number: " + board_id);

  //SPI LoRa pins
  SPI.begin(SCK, MISO, MOSI, SS);
  //setup LoRa transceiver module
  LoRa.setPins(SS, RST, DIO0);
  
  if (!LoRa.begin(BAND)) {
    Serial.println("No se ha podido iniciar LoRa");
    while (1);
  }
  Serial.println("He iniciado LoRa!");
  create();
  Wire.begin(21, 22);
  if (!axp.begin(Wire, AXP192_SLAVE_ADDRESS)) {
    Serial.println("AXP192 Begin PASS");
  } else {
    Serial.println("AXP192 Begin FAIL");
  }
  axp.setPowerOutPut(AXP192_LDO2, AXP202_ON);
  axp.setPowerOutPut(AXP192_LDO3, AXP202_ON);
  axp.setPowerOutPut(AXP192_DCDC2, AXP202_ON);
  axp.setPowerOutPut(AXP192_EXTEN, AXP202_ON);
  axp.setPowerOutPut(AXP192_DCDC1, AXP202_ON);
  GPS.begin(9600, SERIAL_8N1, 34, 12);   //17-TX 18-RX
  
  pasttime = clock() / CLOCKS_PER_SEC;
}

void Datasending(int sensorVlaue) {
  Serial.print("Sensor data: ");
  Serial.print(sensorValue, DEC);
  Serial.println(" PPM");     
  Serial.print("Latitude  : ");
  Serial.println(gps.location.lat(), 5);
  Serial.print("Longitude : ");
  Serial.println(gps.location.lng(), 4);
  Serial.print("Time      : ");
  Serial.print(gps.time.hour());
  Serial.print(":");
  Serial.print(gps.time.minute());
  Serial.print(":");
  Serial.println(gps.time.second());
  Serial.println("**********************");
  
      identifier = rand() % 999999;
      push(identifier);
      LoRa.beginPacket();
      // there's no separator, but here comes the message identifier
      LoRa.print(identifier);
      LoRa.print("d"); // here comes the device identifier
      LoRa.print(board_id);
      LoRa.print("d"); // here comes the sensor data
      LoRa.print(sensorValue);
      LoRa.print("d"); // here comes the number of sats
      LoRa.print(gps.satellites.value());
      LoRa.print("d"); // here comes the lat
      LoRa.print(gps.location.lat(), 5);
      LoRa.print("d"); // here comes the long
      LoRa.print(gps.location.lng(), 5);
      LoRa.endPacket();
    ++counter;
    pasttime = clock() / CLOCKS_PER_SEC;
    Serial.println("Acabo de enviar un mensaje.");
}

void readAndRepeatLora() {
    while (LoRa.available()) {
      LoRaData = LoRa.readString();
    }
    Serial.print("He recibido el mensaje: ");
    Serial.println(LoRaData);
    if (!exists(atoi(LoRaData.c_str()))) {
    Serial.println("Voy a esperar un poco antes de repetirlo");
    delay((rand() % (5000 - 500 + 1) + 500));
      push(atoi(LoRaData.c_str()));
      LoRa.beginPacket();
      Serial.println("Repito el mensaje");
      LoRa.print(LoRaData);
      LoRa.endPacket();
    } else {
      Serial.println("Ya he repetido este mensaje. Voy a ignorarlo.");
    }
}

void loop() {
  //int sec = clock() / CLOCKS_PER_SEC;
      Serial.println("Voy a enviar un mensaje con la siguiente información:");
      //lectura analogica del dato input pin GPIO02
      sensorValue = analogRead(02);
      Datasending(sensorValue);

      //mirar tambe
      //smartDelay(5000);
      delay(5000);
   //Mirar mas adelante
   int packetSize = LoRa.parsePacket();
   if (packetSize) {
    Serial.println("He recibido un mensaje de otra placa.");
    readAndRepeatLora();
   }
}


static void smartDelay(unsigned long ms)
{
  unsigned long start = millis();
  do
  {
    while (GPS.available())
      gps.encode(GPS.read());
  } while (millis() - start < ms);
}
