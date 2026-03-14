import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SensorCard from '@/Components/SensorCard';
import ActuatorControl from '@/Components/ActuatorControl';
import ModernCard, { ModernCardHeader, ModernCardBody } from '@/Components/ModernCard';
import StarryBackground from '@/Components/StarryBackground';
import apiClient from '@/apiClient'; // Import apiClient
import mqttService from '@/mqttService';

// Placeholder icons
const TempIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V4a4 4 0 00-8 0v12a6 6 0 0012 0v-3m-4 3H9" /></svg>;
const HumidityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5A6.5 6.5 0 1112 5.5a6.5 6.5 0 010 13zM12 12a2 2 0 100-4 2 2 0 000 4z" /></svg>;
const SoilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M12 12V2m0 10l-4 4m4-4l4 4" /></svg>;

export default function Dashboard({ auth }) {
    const [latestValues, setLatestValues] = useState({ temperature: 0, humidity: 0, soilMoisture: 0 });
    const [historicalData, setHistoricalData] = useState([]);
    const [historicalData2, setHistoricalData2] = useState([]);
    const [actuators, setActuators] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [selectedSensor2, setSelectedSensor2] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Get user data from the hook inside the layout
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Fetch initial device data
        const fetchDevices = async () => {
            try {
                const response = await apiClient.get('/iot-devices');
                // Associate farm with devices (from user or device.farm if provided)
                const actuatorDevices = response.data.data
                    .filter(d => d.type && d.type.toLowerCase() === 'actuator')
                    .map(d => {
                        const farmResolved = d.farm ?? user?.farms?.find(f => f.id === d.farm_id) ?? null;
                        return farmResolved ? { ...d, farm: farmResolved } : null;
                    })
                    .filter(Boolean);
                setActuators(actuatorDevices);

                const sensorDevices = response.data.data
                    .filter(d => d.type && d.type.toLowerCase() === 'sensor')
                    .map(d => {
                        const farmResolved = d.farm ?? user?.farms?.find(f => f.id === d.farm_id) ?? null;
                        return farmResolved ? { ...d, farm: farmResolved } : null;
                    })
                    .filter(Boolean);
                setSensors(sensorDevices);
                // #region agent log
                fetch('http://127.0.0.1:7917/ingest/269a681f-7603-402d-9878-ffea8360bdcb',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6808c2'},body:JSON.stringify({sessionId:'6808c2',runId:'pre-fix',hypothesisId:'H1',location:'Dashboard.jsx:fetchDevices',message:'sensors loaded',data:{sensorCount:sensorDevices.length,sensors:sensorDevices.map(s=>({id:s.id,name:s.name,farmId:s.farm?.id}))},timestamp:Date.now()})}).catch(()=>{});
                // #endregion agent log
                if (sensorDevices.length > 0) {
                    setSelectedSensor(sensorDevices[0]);
                    if (!selectedSensor2) {
                        setSelectedSensor2(sensorDevices[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch devices", err);
                setError("Could not load actuator devices.");
            }
        };

        fetchDevices();
        setLoading(false);

        // Dynamic subscription for the selected sensor (temperature line)
        const base = import.meta.env.VITE_MQTT_TOPIC_BASE || 'farm';
        let subscribedTopic = null;
        const handleSensorMsg = (message) => {
            const value = parseFloat(message);
            const now = new Date();
            const entry = { time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: isNaN(value) ? 0 : value };
            // #region agent log
            fetch('http://127.0.0.1:7917/ingest/269a681f-7603-402d-9878-ffea8360bdcb',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6808c2'},body:JSON.stringify({sessionId:'6808c2',runId:'pre-fix',hypothesisId:'H3',location:'Dashboard.jsx:handleSensorMsg',message:'mqtt message received',data:{rawMessage:message,parsedValue:value,selectedSensorId:selectedSensor?.id},timestamp:Date.now()})}).catch(()=>{});
            // #endregion agent log
            setLatestValues(prev => ({ ...prev, temperature: entry.value }));
            setHistoricalData(prev => [...prev.slice(-9), entry]);
        };
        if (selectedSensor) {
            const topic = `${base}/${selectedSensor.farm.id}/sensors/${selectedSensor.name.toLowerCase().replace(/\s+/g, '-')}`;
            // #region agent log
            fetch('http://127.0.0.1:7917/ingest/269a681f-7603-402d-9878-ffea8360bdcb',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6808c2'},body:JSON.stringify({sessionId:'6808c2',runId:'pre-fix',hypothesisId:'H2',location:'Dashboard.jsx:useEffect',message:'subscribing to sensor topic',data:{topic,base,farmId:selectedSensor.farm.id,sensorId:selectedSensor.id,sensorName:selectedSensor.name},timestamp:Date.now()})}).catch(()=>{});
            // #endregion agent log
            mqttService.subscribe(topic, handleSensorMsg);
            subscribedTopic = topic;
        }

        return () => {
            // no-op: mqttService manages single client; we don't unsubscribe per-topic in minimal wrapper
        };
    }, [user.farms, selectedSensor]);

    useEffect(() => {
        const base = import.meta.env.VITE_MQTT_TOPIC_BASE || 'farm';
        const handleSensorMsg2 = (message) => {
            const value = parseFloat(message);
            const now = new Date();
            const entry = { time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: isNaN(value) ? 0 : value };
            setLatestValues(prev => ({ ...prev, humidity: entry.value }));
            setHistoricalData2(prev => [...prev.slice(-9), entry]);
        };
        if (selectedSensor2) {
            const topic = `${base}/${selectedSensor2.farm.id}/sensors/${selectedSensor2.name.toLowerCase().replace(/\s+/g, '-')}`;
            mqttService.subscribe(topic, handleSensorMsg2);
        }
        return () => {};
    }, [user.farms, selectedSensor2]);

    return (
        <StarryBackground>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-2xl bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Smart Farm Dashboard
                        </h2>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-cyan-300">Live</span>
                        </div>
                    </div>
                }
            >
                <Head title="Dashboard" />

                <div className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                        {/* Sensor Cards Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ModernCard variant="cosmic" hover={true}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-300">Temperature</p>
                                        <p className="text-3xl font-bold text-white">
                                            {latestValues.temperature.toFixed(1)}°C
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-400/30">
                                        <TempIcon />
                                    </div>
                                </div>
                            </ModernCard>

                            <ModernCard variant="stardust" hover={true}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-indigo-300">Humidity</p>
                                        <p className="text-3xl font-bold text-white">
                                            {latestValues.humidity.toFixed(1)}%
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-400/30">
                                        <HumidityIcon />
                                    </div>
                                </div>
                            </ModernCard>

                            <ModernCard variant="nebula" hover={true}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-cyan-300">Soil Moisture</p>
                                        <p className="text-3xl font-bold text-white">
                                            {latestValues.soilMoisture.toFixed(1)}%
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-400/30">
                                        <SoilIcon />
                                    </div>
                                </div>
                            </ModernCard>
                        </div>

                        {/* Actuator Control Section */}
                        <ModernCard variant="cosmicGlass">
                            <ModernCardHeader>
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Device Controls
                                </h3>
                            </ModernCardHeader>
                            <ModernCardBody>
                                {loading && (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                    </div>
                                )}
                                {error && (
                                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                                        <p className="text-red-300">{error}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {!loading && actuators.length > 0 ? actuators.filter(actuator => actuator.status !== 'inactive').map(actuator => (
                                        <ActuatorControl key={actuator.id} actuator={actuator} />
                                    )) : !loading && (
                                        <div className="col-span-full text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="mt-2 text-purple-300">No active actuator devices found.</p>
                                            <p className="text-sm text-purple-400">Activate devices in IoT Devices page to control them.</p>
                                        </div>
                                    )}
                                </div>
                            </ModernCardBody>
                        </ModernCard>

                    {/* Chart Section */}
                    <ModernCard variant="cosmicGlass">
                        <ModernCardHeader>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Temperature Trend
                                </h3>
                                {sensors.length > 0 && (
                                    <select
                                        value={selectedSensor?.id ?? ''}
                                        onChange={(e) => {
                                            const s = sensors.find(x => String(x.id) === e.target.value);
                                            setHistoricalData([]);
                                            setSelectedSensor(s ?? null);
                                        }}
                                        className="bg-gray-800/50 border-purple-400/30 text-purple-100 focus:border-purple-400 focus:ring-purple-400/20 rounded-md shadow-sm text-sm"
                                    >
                                        {sensors.map(s => (
                                            <option key={s.id} value={s.id} className="bg-gray-800">{s.name} (farm {s.farm.id})</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </ModernCardHeader>
                        <ModernCardBody>
                            {selectedSensor && (
                                <p className="text-xs text-purple-300 mb-3">
                                    MQTT topic: <span className="font-mono bg-purple-500/20 px-2 py-1 rounded">{`${import.meta.env.VITE_MQTT_TOPIC_BASE || 'iot'}/${selectedSensor.farm.id}/sensors/${selectedSensor.name.toLowerCase().replace(/\s+/g, '-')}`}</span>
                                </p>
                            )}
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 51, 234, 0.2)"/>
                                        <XAxis dataKey="time" stroke="#9333EA" />
                                        <YAxis stroke="#9333EA" domain={['dataMin - 2', 'dataMax + 2']} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                                                borderColor: 'rgba(147, 51, 234, 0.3)',
                                                borderRadius: '8px'
                                            }} 
                                        />
                                        <Legend />
                                        <Line 
                                            isAnimationActive={false} 
                                            type="monotone" 
                                            dataKey="value" 
                                            name="Temperature" 
                                            stroke="url(#purpleGradient)" 
                                            strokeWidth={3} 
                                            dot={false}
                                        />
                                        <defs>
                                            <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#9333EA" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#6366F1" stopOpacity={1} />
                                            </linearGradient>
                                        </defs>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </ModernCardBody>
                    </ModernCard>

                    {/* Second Chart Section */}
                    <ModernCard variant="cosmicGlass">
                        <ModernCardHeader>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                    </svg>
                                    Humidity Trend
                                </h3>
                                {sensors.length > 0 && (
                                    <select
                                        value={selectedSensor2?.id ?? ''}
                                        onChange={(e) => {
                                            const s = sensors.find(x => String(x.id) === e.target.value);
                                            setHistoricalData2([]);
                                            setSelectedSensor2(s ?? null);
                                        }}
                                        className="bg-gray-800/50 border-purple-400/30 text-purple-100 focus:border-purple-400 focus:ring-purple-400/20 rounded-md shadow-sm text-sm"
                                    >
                                        {sensors.map(s => (
                                            <option key={s.id} value={s.id} className="bg-gray-800">{s.name} (farm {s.farm.id})</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </ModernCardHeader>
                        <ModernCardBody>
                            {selectedSensor2 && (
                                <p className="text-xs text-purple-300 mb-3">
                                    MQTT topic: <span className="font-mono bg-purple-500/20 px-2 py-1 rounded">{`${import.meta.env.VITE_MQTT_TOPIC_BASE || 'iot'}/${selectedSensor2.farm.id}/sensors/${selectedSensor2.name.toLowerCase().replace(/\s+/g, '-')}`}</span>
                                </p>
                            )}
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={historicalData2} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.2)"/>
                                        <XAxis dataKey="time" stroke="#06B6D4" />
                                        <YAxis stroke="#06B6D4" domain={['dataMin - 2', 'dataMax + 2']} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                                                borderColor: 'rgba(6, 182, 212, 0.3)',
                                                borderRadius: '8px'
                                            }} 
                                        />
                                        <Legend />
                                        <Line 
                                            isAnimationActive={false} 
                                            type="monotone" 
                                            dataKey="value" 
                                            name="Humidity" 
                                            stroke="url(#cyanGradient)" 
                                            strokeWidth={3} 
                                            dot={false}
                                        />
                                        <defs>
                                            <linearGradient id="cyanGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#06B6D4" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#0891B2" stopOpacity={1} />
                                            </linearGradient>
                                        </defs>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </ModernCardBody>
                    </ModernCard>

                    </div>
                </div>
            </AuthenticatedLayout>
        </StarryBackground>
    );
}
