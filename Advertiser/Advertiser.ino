#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "esp_sleep.h"

#include "BLEDevice.h"

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

#define PROJECT_COMPANY_IDENTIFIER (0xA93F)

#define GPIO_DEEP_SLEEP_DURATION (250000LL) // sleep x seconds and then wake up
#define BLE_ADVERTISING_DURATION (1000)     // Maximum advertisement duration

#if 1 // 1
#define SKI_POLE_ADVERTISER_1
#else // 2
#define SKI_POLE_ADVERTISER_2
#endif

/* MPU6050 IMU - Global Variables and Defines */
#define ACCELERATION_NUMBER_OF_AXIS (3)
#define GYRO_NUMBER_OF_AXIS (3)
#define TEMPERATURE_AXIS (0)
#define FLOAT_ENCODE_SIZE_IN_BYTES (3)

#define ENCODED_SENSOR_DATA_SIZE (((ACCELERATION_NUMBER_OF_AXIS + GYRO_NUMBER_OF_AXIS + TEMPERATURE_AXIS) * FLOAT_ENCODE_SIZE_IN_BYTES) + 1)

Adafruit_MPU6050 mpu;
uint8_t encoded_sensor_data_buffer[ENCODED_SENSOR_DATA_SIZE];

#define BLE_COMPANY_IDENTIFIER_SIZE (2) // 2 bytes
#define BLE_ESP32_IDENTIFIER_SIZE (1)   // 2 bytes
#define BLE_PACKET_IDENTIFIER_SIZE (1)  // 2 bytes

#define BLE_ADVERTISEMENT_PACKET_HEADER_SIZE (BLE_COMPANY_IDENTIFIER_SIZE + BLE_ESP32_IDENTIFIER_SIZE + BLE_PACKET_IDENTIFIER_SIZE)

#define BLE_ADVERTISEMENT_MPU_SENSOR_PACKET_SIZE (ENCODED_SENSOR_DATA_SIZE + BLE_ADVERTISEMENT_PACKET_HEADER_SIZE)

#if (BLE_ADVERTISEMENT_MPU_SENSOR_PACKET_SIZE > 24)
#error Advertisement Packet Size is too large
#endif

/* BLE Global - Variables and Defines */
#define MANUFACTURER_DATA_SIZE (BLE_ADVERTISEMENT_MPU_SENSOR_PACKET_SIZE)

#if 1
char manufacturerData[MANUFACTURER_DATA_SIZE] = {0};
#else
char manufacturerData[MANUFACTURER_DATA_SIZE] = {0xA9, 0x3F,
                                                 0x14, 0x02,
                                                 0x03, 0x04,
                                                 0x05, 0x06,
                                                 0x07, 0x08,
                                                 0x09, 0x0A,
                                                 0x23, 0x11,
                                                 0x01, 0x02,
                                                 0x03, 0x04,
                                                 0x23, 0x11,
                                                 0x01, 0x02,
                                                 0x03};
#endif

BLEAdvertising *pAdvertising;
BLEAdvertisementData advertising_data = BLEAdvertisementData();

// =================================
// IMU MPU6050 - Setup Function
// =================================
void mpu6050_setup()
{
  // Try to initialize IMU Sensor!
  if (!mpu.begin())
  {
    Serial.println("Failed to find MPU6050 chip");
    while (1)
    {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found and Initialized!");

  // Set up IMU Sensor ranges
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  delay(100);
}

// =================================
// Decode and Encode functions below
// =================================
void encode_float(uint8_t *encoded_float, int encode_len, float float_num)
{
  memset(encoded_float, '\0', encode_len);

  *encoded_float = (float_num < 0) ? '-' : '+'; // sign
  encoded_float++;

  *encoded_float = abs((int)(float_num)); // whole part
  encoded_float++;

  *encoded_float = abs((int)((float_num - (int)float_num) * 100)); // decimal part
  encoded_float++;
}

float decode_float(uint8_t *encoded_float, int encode_len)
{
  float float_num = 0.0f;

  uint8_t float_number_sign = *encoded_float;
  encoded_float++;

  float_num = *encoded_float;
  encoded_float++;

  float_num = float_num + ((float)(*encoded_float) / 100);
  encoded_float++;

  float_num = (char)(float_number_sign) == '-' ? (float_num * -1.0) : (float_num * 1.0);

  return float_num;
}

// =================================
// Encode Sensor Data functions below
// =================================
void encode_acceleration_x(uint8_t *encoded_sensor_data_buffer, float acceleration_x)
{
  encode_float(&encoded_sensor_data_buffer[0], FLOAT_ENCODE_SIZE_IN_BYTES, acceleration_x);
}
void encode_acceleration_y(uint8_t *encoded_sensor_data_buffer, float acceleration_y)
{
  encode_float(&encoded_sensor_data_buffer[3], FLOAT_ENCODE_SIZE_IN_BYTES, acceleration_y);
}
void encode_acceleration_z(uint8_t *encoded_sensor_data_buffer, float acceleration_z)
{
  encode_float(&encoded_sensor_data_buffer[6], FLOAT_ENCODE_SIZE_IN_BYTES, acceleration_z);
}

void encode_gyro_x(uint8_t *encoded_sensor_data_buffer, float gyro_x)
{
  encode_float(&encoded_sensor_data_buffer[9], FLOAT_ENCODE_SIZE_IN_BYTES, gyro_x);
}
void encode_gyro_y(uint8_t *encoded_sensor_data_buffer, float gyro_y)
{
  encode_float(&encoded_sensor_data_buffer[12], FLOAT_ENCODE_SIZE_IN_BYTES, gyro_y);
}
void encode_gyro_z(uint8_t *encoded_sensor_data_buffer, float gyro_z)
{
  encode_float(&encoded_sensor_data_buffer[15], FLOAT_ENCODE_SIZE_IN_BYTES, gyro_z);
}

// =================================
// Decode Sensor Data functions below
// =================================
float decode_acceleration_x(uint8_t *encoded_sensor_data_buffer)
{
  return decode_float(&encoded_sensor_data_buffer[0], FLOAT_ENCODE_SIZE_IN_BYTES);
}
float decode_acceleration_y(uint8_t *encoded_sensor_data_buffer)
{
  return decode_float(&encoded_sensor_data_buffer[3], FLOAT_ENCODE_SIZE_IN_BYTES);
}
float decode_acceleration_z(uint8_t *encoded_sensor_data_buffer)
{
  return decode_float(&encoded_sensor_data_buffer[6], FLOAT_ENCODE_SIZE_IN_BYTES);
}

float decode_gyro_x(uint8_t *encoded_sensor_data_buffer)
{
  return decode_float(&encoded_sensor_data_buffer[9], FLOAT_ENCODE_SIZE_IN_BYTES);
}
float decode_gyro_y(uint8_t *encoded_sensor_data_buffer)
{
  return decode_float(&encoded_sensor_data_buffer[12], FLOAT_ENCODE_SIZE_IN_BYTES);
}
float decode_gyro_z(uint8_t *encoded_sensor_data_buffer)
{
  return decode_float(&encoded_sensor_data_buffer[15], FLOAT_ENCODE_SIZE_IN_BYTES);
}

// ========================================
// IMU MPU6050 - Data Capture Loop Function
// ========================================
void mpu6050_data_capture()
{
  printf("Capturing Data from MPU6050 Sensor\n");

  /* Get new sensor events with the readings */
  sensors_event_t a, g, temp;

  // Erase previous data from IMU Sensor
  memset(encoded_sensor_data_buffer, '\0', ENCODED_SENSOR_DATA_SIZE);

  // Get new data from IMU Sensor
  mpu.getEvent(&a, &g, &temp);

#if 1
  // Encode accX
  encode_acceleration_x(encoded_sensor_data_buffer, a.acceleration.x);
  // Encode accY
  encode_acceleration_y(encoded_sensor_data_buffer, a.acceleration.y);
  // Encode accZ
  encode_acceleration_z(encoded_sensor_data_buffer, a.acceleration.z);
#endif

#if 1
  // Encode rotation x
  encode_gyro_x(encoded_sensor_data_buffer, g.gyro.x);
  // Encode rotation y
  encode_gyro_y(encoded_sensor_data_buffer, g.gyro.y);
  // Encode rotation z
  encode_gyro_z(encoded_sensor_data_buffer, g.gyro.z);
#endif

#if 1 // Test Print out of IMU Sensor Data
  printf("AccX:%f, Decode_after_Encode:%f\n", a.acceleration.x, decode_acceleration_x(encoded_sensor_data_buffer));
  printf("AccY:%f, Decode_after_Encode:%f\n", a.acceleration.y, decode_acceleration_y(encoded_sensor_data_buffer));
  printf("AccZ:%f, Decode_after_Encode:%f\n", a.acceleration.z, decode_acceleration_z(encoded_sensor_data_buffer));

  printf("RotX:%f, Decode_after_Encode:%f\n", g.gyro.x, decode_gyro_x(encoded_sensor_data_buffer));
  printf("RotY:%f, Decode_after_Encode:%f\n", g.gyro.y, decode_gyro_y(encoded_sensor_data_buffer));
  printf("RotZ:%f, Decode_after_Encode:%f\n", g.gyro.z, decode_gyro_z(encoded_sensor_data_buffer));

  test_print_encoded_sensor_data();
#endif
}

// =================================
// BLE - Setup Function
// =================================
void ble_setup()
{
  Serial.printf("\nStarting Advertiser Setup Code\n");

// Initialize BLE Devie
#if defined(SKI_POLE_ADVERTISER_1)
  BLEDevice::init("SkiPoleAdvertiser1");
#endif

#if defined(SKI_POLE_ADVERTISER_2)
  BLEDevice::init("SkiPoleAdvertiser2");
#endif

  // Initialize Advertising variable of the BLEDevice created previously
  pAdvertising = BLEDevice::getAdvertising();
}

// =================================
// BLE - Advertising Functions
// =================================

void ble_update_manufacturer_data()
{

  manufacturerData[0] = 0xA9;
  manufacturerData[1] = 0x3F;
  manufacturerData[2] = 0x01;
  manufacturerData[3] = 0x01;
  manufacturerData[4] = 0x00;
  // manufacturerData[5] = 0x00;
  for (int i = 0; i < ENCODED_SENSOR_DATA_SIZE; i++)
  {
    manufacturerData[i + 5] = (char)encoded_sensor_data_buffer[i];
  }

  advertising_data.setManufacturerData(std::string(manufacturerData, MANUFACTURER_DATA_SIZE));
}

void ble_set_advertisement_packet_information()
{
  // Setting Advertising Packet type - Non Connectable
  //  advertising_data.setFlags(0x04);
  pAdvertising->setAdvertisementData(advertising_data);
  pAdvertising->setAdvertisementType(ADV_TYPE_NONCONN_IND);
}

void ble_start_advertising()
{
  printf("BLE Advertising Starting\n");
  BLEDevice::startAdvertising();
}

void ble_stop_advertising()
{
  BLEDevice::stopAdvertising();
}

// =============================
// Test Functions below
// =============================

void test_print_encoded_sensor_data()
{
  for (int i = 0; i < ENCODED_SENSOR_DATA_SIZE; i++)
  {
    printf("%d:%d ", i, encoded_sensor_data_buffer[i]);
  }
  printf("\n");
}

// ===============================================
//                    Setup
// ===============================================

void setup()
{
  Serial.begin(115200);
  printf("Device Re-started\n");
  while (!Serial)
  {
    delay(10); // will pause Zero, Leonardo, etc until serial console opens
  }

  // Setup settings for the MPU6050
  mpu6050_setup();

  delay(1000); // delay after IMU Setup to capture data

#if 1
  mpu6050_data_capture();
#endif

  // Setup BLE Advertising
  ble_setup();

#if 1
  ble_update_manufacturer_data();
  ble_set_advertisement_packet_information();
  ble_start_advertising();
#endif

  delay(random(250, BLE_ADVERTISING_DURATION));

  ble_stop_advertising();

  esp_deep_sleep(GPIO_DEEP_SLEEP_DURATION);
}

// ===============================================
//                      Loop
// ===============================================
void loop()
{
#if 0
#if 0
  // ble_stop_advertising();
#endif

#if 0
  delay(5000);
#endif

#if 0
  mpu6050_data_capture();
#endif

#if 0
  ble_update_manufacturer_data();
  ble_set_advertisement_packet_information();
  ble_start_advertising();
#endif
#endif
}
