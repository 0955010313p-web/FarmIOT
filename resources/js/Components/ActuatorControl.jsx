import React, { useState } from 'react';
import mqttService from '@/mqttService';

const ActuatorControl = ({ actuator }) => {
    // The actuator object now contains the farm object: { id, name, type, farm: { id, name, ... } }
    const [displayStatus, setDisplayStatus] = useState('off'); // Default to off, real status should come from a status topic
    const [isLoading, setIsLoading] = useState(false);

    // --- Check if the required data is available ---
    if (!actuator || !actuator.farm) {
        return (
            <div className="bg-gray-700 rounded-lg shadow-md p-6">
                <p className="text-red-400">Error: Incomplete device data.</p>
            </div>
        );
    }

    const handleToggle = () => {
        const newStatus = displayStatus === 'on' ? 'off' : 'on';
        const valueToSend = newStatus === 'on' ? 1 : 0;

        // --- 1. Construct the DYNAMIC Topic --- 
        // Format: farm/{farm_id}/actuators/{device_name}
        const topic = `farm/${actuator.farm.id}/actuators/${actuator.name.toLowerCase().replace(/\s+/g, '-')}`;

        // --- 2. Construct the JSON Message ---
        const message = JSON.stringify({
            device: actuator.name,
            value: valueToSend
        });

        console.log(`Publishing to topic: ${topic}`);
        console.log(`Publishing message: ${message}`);

        // Publish to MQTT Broker
        mqttService.publish(topic, message);

        // Update UI immediately
        setDisplayStatus(newStatus);
    };

    const isToggled = displayStatus === 'on';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{actuator.name}</p>
                    <p className={`text-sm font-medium ${isToggled ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        Status: {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                    </p>
                     <p className="text-xs text-gray-400 dark:text-gray-500">Farm: {actuator.farm.name}</p>
                </div>
                <div className="relative">
                    <button
                        onClick={handleToggle}
                        disabled={isLoading}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${
                            isToggled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                                isToggled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActuatorControl;
