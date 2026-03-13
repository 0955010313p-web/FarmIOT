export const initialSensorData = {
    temperature: [
        { time: '08:00', value: 25 },
        { time: '09:00', value: 26 },
        { time: '10:00', value: 28 },
        { time: '11:00', value: 30 },
    ],
    humidity: [
        { time: '08:00', value: 60 },
        { time: '09:00', value: 58 },
        { time: '10:00', value: 55 },
        { time: '11:00', value: 53 },
    ],
    soilMoisture: [
        { time: '08:00', value: 45 },
        { time: '09:00', value: 42 },
        { time: '10:00', value: 40 },
        { time: '11:00', value: 38 },
    ],
};

// Function to get the latest value for a sensor
export const getLatestSensorValues = () => ({
    temperature: initialSensorData.temperature[initialSensorData.temperature.length - 1].value,
    humidity: initialSensorData.humidity[initialSensorData.humidity.length - 1].value,
    soilMoisture: initialSensorData.soilMoisture[initialSensorData.soilMoisture.length - 1].value,
});
