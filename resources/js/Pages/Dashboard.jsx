import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SensorCard from '@/Components/SensorCard';
import ActuatorControl from '@/Components/ActuatorControl';
import mqttService from '@/mqttService';
import apiClient from '@/apiClient'; // Import apiClient

// Placeholder icons
const TempIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V4a4 4 0 00-8 0v12a6 6 0 0012 0v-3m-4 3H9" /></svg>;
const HumidityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5A6.5 6.5 0 1112 5.5a6.5 6.5 0 010 13zM12 12a2 2 0 100-4 2 2 0 000 4z" /></svg>;
const SoilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M12 12V2m0 10l-4 4m4-4l4 4" /></svg>;

export default function Dashboard({ auth }) {
    const [latestValues, setLatestValues] = useState({ temperature: 0, humidity: 0, soilMoisture: 0 });
    const [historicalData, setHistoricalData] = useState([]);
    const [actuators, setActuators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Get user data from the hook inside the layout
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Fetch initial device data
        const fetchDevices = async () => {
            try {
                const response = await apiClient.get('/iot-devices');
                // We need to associate the farm with the actuator device
                // The API for iot-devices should ideally include farm info
                // For now, we assume devices have farm_id and we can find the farm from the user object
                const actuatorDevices = response.data.data
                    .filter(device => device.type.toLowerCase() === 'actuator')
                    .map(device => {
                        const farm = user.farms.find(f => f.id === device.farm_id);
                        return { ...device, farm: farm }; // Attach farm object to device
                    });
                setActuators(actuatorDevices);
            } catch (err) {
                console.error("Failed to fetch devices", err);
                setError("Could not load actuator devices.");
            }
        };

        fetchDevices();
        setLoading(false);

        const handleTemperature = (message) => {
            const newValue = parseFloat(message);
            const now = new Date();
            const newEntry = { time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: newValue };
            setLatestValues(prev => ({ ...prev, temperature: newValue }));
            setHistoricalData(prev => [...prev.slice(-9), newEntry]);
        };
        
        const handleHumidity = (message) => {
            setLatestValues(prev => ({ ...prev, humidity: parseFloat(message) }));
        };

        const handleSoilMoisture = (message) => {
            setLatestValues(prev => ({ ...prev, soilMoisture: parseFloat(message) }));
        };

        // Subscribe to relevant sensor topics
        // In a real app, these topics would also be dynamic based on the user's farms/devices
        mqttService.subscribe('farm/sensors/temperature', handleTemperature);
        mqttService.subscribe('farm/sensors/humidity', handleHumidity);
        mqttService.subscribe('farm/sensors/soil_moisture', handleSoilMoisture);

        return () => {
            // Disconnecting here might be too aggressive if you navigate away and back quickly.
            // Consider a more sophisticated connection management.
            // mqttService.disconnect(); 
        };
    }, [user.farms]);

    return (
        <AuthenticatedLayout
            user={auth.user} // Keep this for the layout to work as it is now
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Smart Farm Dashboard (Live)</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Sensor Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <SensorCard icon={<TempIcon />} label="Temperature" value={latestValues.temperature.toFixed(2)} unit="°C" />
                        <SensorCard icon={<HumidityIcon />} label="Humidity" value={latestValues.humidity.toFixed(2)} unit="%" />
                        <SensorCard icon={<SoilIcon />} label="Soil Moisture" value={latestValues.soilMoisture.toFixed(2)} unit="%" />
                    </div>

                    {/* Actuator Control Section */}
                     <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Actuator Controls</h3>
                        {loading && <p className="text-gray-300">Loading actuators...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {!loading && actuators.length > 0 ? actuators.map(actuator => (
                                <ActuatorControl key={actuator.id} actuator={actuator} />
                            )) : <p className="text-gray-400">No actuator devices found. Please add one in the IoT Devices page.</p>}
                        </div>
                    </div>

                    {/* Chart Section - no changes here */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-medium mb-4">Live Temperature Trend (°C)</h3>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.3)"/>
                                        <XAxis dataKey="time" stroke="#9CA3AF" />
                                        <YAxis stroke="#9CA3AF" domain={['dataMin - 2', 'dataMax + 2']} />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(107, 114, 128, 0.5)' }} />
                                        <Legend />
                                        <Line isAnimationActive={false} type="monotone" dataKey="value" name="Temperature" stroke="#8884d8" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
