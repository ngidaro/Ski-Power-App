package com.example.scanner_ble_nordic_java;

import android.nfc.Tag;
import android.os.Bundle;
import android.util.Log;
import android.util.SparseArray;

import androidx.annotation.LongDef;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import no.nordicsemi.android.support.v18.scanner.BluetoothLeScannerCompat;
import no.nordicsemi.android.support.v18.scanner.ScanCallback;
import no.nordicsemi.android.support.v18.scanner.ScanFilter;
import no.nordicsemi.android.support.v18.scanner.ScanRecord;
import no.nordicsemi.android.support.v18.scanner.ScanResult;
import no.nordicsemi.android.support.v18.scanner.ScanSettings;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "ESP32_Advertisement_Packet_Scanned";

    private int mCompanyId = 16297; // 0x3FA9 Company Identifier
    BluetoothLeScannerCompat scanner;


    private int encode_len = 3;

    private float decode_float(byte[] encoded_float, int encode_len) {
        float float_num = 0.0f;

        float_num = encoded_float[1];
        float_num = float_num + ((float) (encoded_float[2]) / 100);
        float_num = (encoded_float[0]) == 45 ? (float_num * -1.0f) : (float_num); // 45 is negative char check
        return float_num;
    }

    // =================================
    // Decode Sensor Data functions below
    // =================================
    private float decode_acceleration_x(byte[] encoded_sensor_data_buffer) {
        int start_index = 0;
        return decode_float(Arrays.copyOfRange(encoded_sensor_data_buffer, start_index, start_index + encode_len), encode_len);
    }

    private float decode_acceleration_y(byte[] encoded_sensor_data_buffer) {
        int start_index = 3;
        return decode_float(Arrays.copyOfRange(encoded_sensor_data_buffer, start_index, start_index + encode_len), encode_len);
    }

    private float decode_acceleration_z(byte[] encoded_sensor_data_buffer) {
        int start_index = 6;
        return decode_float(Arrays.copyOfRange(encoded_sensor_data_buffer, start_index, start_index + encode_len), encode_len);
    }

    private float decode_gyro_x(byte[] encoded_sensor_data_buffer) {
        int start_index = 9;
        return decode_float(Arrays.copyOfRange(encoded_sensor_data_buffer, start_index, start_index + encode_len), encode_len);
    }

    private float decode_gyro_y(byte[] encoded_sensor_data_buffer) {
        int start_index = 12;
        return decode_float(Arrays.copyOfRange(encoded_sensor_data_buffer, start_index, start_index + encode_len), encode_len);
    }

    private float decode_gyro_z(byte[] encoded_sensor_data_buffer) {
        int start_index = 15;
        return decode_float(Arrays.copyOfRange(encoded_sensor_data_buffer, start_index, start_index + encode_len), encode_len);
    }

    private void test_print_decoded_imu_sensor_data_mpu6050(byte[] encoded_sensor_data_buffer) {
        Log.d(TAG, String.format("AccX:%f\n", decode_acceleration_x(encoded_sensor_data_buffer)));
        Log.d(TAG, String.format("AccY:%f\n", decode_acceleration_y(encoded_sensor_data_buffer)));
        Log.d(TAG, String.format("AccZ:%f\n", decode_acceleration_z(encoded_sensor_data_buffer)));

        Log.d(TAG, String.format("RotX:%f\n", decode_gyro_x(encoded_sensor_data_buffer)));
        Log.d(TAG, String.format("RotY:%f\n", decode_gyro_y(encoded_sensor_data_buffer)));
        Log.d(TAG, String.format("RotZ:%f\n", decode_gyro_z(encoded_sensor_data_buffer)));

    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        scanner = BluetoothLeScannerCompat.getScanner();
        ScanSettings settings = new ScanSettings.Builder()
//                .setLegacy(false)
//                .setLegacy(true)
                .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                .setReportDelay(250)
                .setUseHardwareBatchingIfSupported(true)
                .build();

        ScanFilter mCompanyId_filter = new ScanFilter.Builder().setManufacturerData(mCompanyId, null).build();

        ScanCallback scanCallback = new ScanCallback() {
            @Override
            public void onScanResult(int callbackType, @NonNull ScanResult result) {
                super.onScanResult(callbackType, result);
                Log.d(TAG, "onScanResult");
            }

            @Override
            public void onBatchScanResults(@NonNull List<ScanResult> results) {
                super.onBatchScanResults(results);
                Log.d(TAG, "onBatchScanResults");

                for (int i = 0; i < results.size(); i++) {
                    ScanRecord scanRecord = results.get(i).getScanRecord();

//                    Log.d(TAG, scanRecord.toString());

                    if (scanRecord != null) {

                        if (mCompanyId_filter.matches(results.get(i)) && (scanRecord.getManufacturerSpecificData() != null)) {
//                            Log.d(TAG, scanRecord.toString());

                            SparseArray<byte[]> manufacturerSpecificData = scanRecord.getManufacturerSpecificData();

                            ArrayList<Byte> manufacturerDataList = new ArrayList<>();

                            int key_index = 0;
                            Log.d(TAG, "" + "companyId" + ":" + manufacturerSpecificData.keyAt(key_index));
                            int manufacturer_size = manufacturerSpecificData.valueAt(key_index).length;
                            for (int j = 0; j < manufacturer_size; j++) {
//                                Log.d(TAG, "data@index" + j + ":" + manufacturerSpecificData.valueAt(key_index)[j]);
                                manufacturerDataList.add(manufacturerSpecificData.valueAt(key_index)[j]);
                            }

                            Log.d(TAG, "Manufacturer data: " + manufacturerDataList.toString());


                            byte[] manufacturerDataArr = new byte[manufacturerDataList.size()];

                            for (int j = 0; j < manufacturerDataList.size(); j++) {
                                manufacturerDataArr[j] = manufacturerDataList.get(j);
                            }

                            switch (manufacturerDataArr[0]) {
                                case 1: // odd
                                    Log.d(TAG, "Sensor data received from Left ESP32");
                                    break;
                                case 2: // even
                                    Log.d(TAG, "Sensor data received from Right ESP32");
                                    break;
                            }

                            test_print_decoded_imu_sensor_data_mpu6050(manufacturerDataArr);
                        }
                    }
                }
            }

            @Override
            public void onScanFailed(int errorCode) {
                super.onScanFailed(errorCode);
                Log.d(TAG, "onScanFailed");
            }
        };

        scanner.startScan(null, settings, scanCallback);
    }
}