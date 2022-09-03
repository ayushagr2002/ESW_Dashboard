#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH1106.h>
#include <ThingSpeak.h>
#include <WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <tinyECC.h>

// oneM2M Libraries
#include <HTTPClient.h>

// HTTPClient http;

// oneM2M IP Address
String  CSE_IP      = "192.168.82.140"; 

// oneM2M : CSE params
int     CSE_HTTP_PORT   = 8080;
String  CSE_NAME        = "in-name";
String  OM2M_ORIGIN_ADMIN  = "admin:admin";

#define OLED_SDA 21
#define OLED_SCL 22

#define TdsSensorPin 35
#define VREF 3.3              // analog reference voltage(Volt) of the ADC
#define SCOUNT  30 

//Adafruit_SH1106 display(21, 22);
WiFiClient client;
const int sensorPin = 34;
char ssid[]="Redmi Note 10S";
char password[] = "Ayush123" ;
unsigned long myChannelNumber = 1834719;
const char *myWriteAPIKey = "Y9FQO0I5SA4WKYQA";
const char *myReadAPIKey = "6SUM6F8C3K2L9KF1";

const int potPin = A0;
float ph;
float Value=0;

int analogBuffer[SCOUNT];     // store the analog value in the array, read from ADC
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0;
int copyIndex = 0;
float averageVoltage = 0;
float tdsValue = 0;
float temperature = 25;
// Temperature Sensor is connected to pin 4
const int TempPin = 4;
// Setup OneWire Instance to communicate with the temperature sensor
OneWire oneWire(TempPin);
// Pass the OneWire Instance to the Dallas Temperature Sensor
DallasTemperature tempSensor(&oneWire); 

  HTTPClient http;
void doPOST(String url, int ty, String rep) {
  http.begin("http://" + String(CSE_IP) + ":" + String(CSE_HTTP_PORT) + "/~/in-cse/in-name/" + url);

  http.addHeader("X-M2M-Origin", OM2M_ORIGIN_ADMIN);
  http.addHeader("Content-Type", "application/json;ty=" + String(ty));
  http.addHeader("Content-Length", String(rep.length()));

  // String req_data = "{\"m2m:cin\": {\"con\": \"" + data + "\",\"cnf\": \"" + description + "\"}}";
  // Serial.println(req_data);
  Serial.println(rep);

  int code = http.POST(rep);
  if(code > 0)
  {
    Serial.println(code);
    Serial.println("Successfully added the reading");
  }
  else
  {
    Serial.println(code);
    Serial.println("Failed to add the reading");
  }
  http.end();
}

String createCI(String ae, String cnt1, String cnt2, String ciContent) {
    String ciRepresentation =
        "{\"m2m:cin\": {"
        "\"con\":\"" + ciContent + "\""
        "}}";
    doPOST(ae + "/" + cnt1 + "/" + cnt2, 4, ciRepresentation);
    return ciRepresentation;
}

void setup() {
  Serial.begin(9600);
  pinMode(potPin, INPUT);
  Serial.println("Started");
  WiFi.begin(ssid,password);
  delay(5000);
  while(WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  WiFi.mode(WIFI_STA);
  ThingSpeak.begin(client);
}

int getTurbidity()
{
  int tds_sensor_value = analogRead(sensorPin);
  Serial.print("Sensor Value: ");
  Serial.println(tds_sensor_value);
  int turbidity = map(tds_sensor_value, 700, 3000, 100, 0);
  // Serial.print("Turbidity :");
  // Serial.println(turbidity);
  return turbidity;
}

float getTDS()
{
   float tdsValue = 0.0;
  averageVoltage = analogRead(TdsSensorPin);
  averageVoltage = averageVoltage * (float)VREF / 4096.0;
  
  //temperature compensation formula: fFinalResult(25^C) = fFinalResult(current)/(1.0+0.02*(fTP-25.0)); 
  float compensationCoefficient = 1.0+0.02*(temperature-25.0);
  //temperature compensation
  float compensationVoltage=averageVoltage/compensationCoefficient;
        
  //convert voltage value to tds value
  tdsValue  = (133.42*compensationVoltage*compensationVoltage*compensationVoltage - 255.86*compensationVoltage*compensationVoltage + 857.39*compensationVoltage)*0.5;
  return tdsValue;
}

float getTemperature()
{
  tempSensor.requestTemperatures();
  double temp = tempSensor.getTempCByIndex(0);
  return temp;
}

float getPH()
{
  Value= analogRead(potPin);
  // Serial.print(Value);
  // Serial.print(" | ");
  float voltage=Value*(3.3/4095.0);
  Serial.println(voltage); 
  ph = (3.3*voltage);
  // Serial.println(ph);
  // delay(1500);
  return ph;
}

void loop() {
  // put your main code here, to run repeatedly:
  delay(5000);
  float temp = getTemperature();
  int TDS = getTDS();
  int turbidity = getTurbidity();
  float ph = getPH();
  Serial.print("Temperature: ");
  Serial.println(temp);+
  Serial.print("TDS: ");
  Serial.println(TDS);
  Serial.print("Turbidity: ");
  Serial.println(turbidity);
  Serial.print("pH: ");
  Serial.println(ph);

  // Thingspeak upload
  ThingSpeak.setField(1, temp);
  ThingSpeak.setField(2, turbidity);
  ThingSpeak.setField(3, TDS);
  ThingSpeak.setField(4, ph);
  ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  delay(5000);

  // float temp = 27;
  // int TDS = 100;
  // int turbidity = 50;
  // float ph = 7.5;

  // // oneM2M upload
  tinyECC e;
  e.plaintext = String(temp) + "," + String(turbidity) + "," + String(TDS) + "," + String(ph);
  e.encrypt();
  String result = createCI("Water-Quality", "Test-Node", "Encrypt", "[" + e.ciphertext + "]");
  result = createCI("Water-Quality", "Test-Node", "Data", "[" + String(temp) + "," + String(turbidity) + "," + String(TDS) + "," + String(ph) + "]");
}