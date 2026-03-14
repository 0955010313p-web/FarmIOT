import React, { useState, useEffect } from 'react';
import apiClient from '@/apiClient';
import Notification from './Notification';
import FeedingStatus from './FeedingStatus';

const ActuatorControl = ({ actuator }) => {
    // The actuator object now contains farm object: { id, name, type, farm: { id, name, ... } }
    const [displayStatus, setDisplayStatus] = useState('off'); // Default to off, real status should come from a status topic
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [showFeedingStatus, setShowFeedingStatus] = useState(false);
    const [feedingStatus, setFeedingStatus] = useState({ canFeed: true, nextFeedingInHours: null });
    const [lastClickTime, setLastClickTime] = useState(0);

    // --- Check if the required data is available ---
    if (!actuator || !actuator.farm) {
        return (
            <div className="bg-gray-700 rounded-lg shadow-md p-6">
                <p className="text-red-400">Error: Incomplete device data.</p>
            </div>
        );
    }

    // Check feeding status when component mounts
    useEffect(() => {
        checkFeedingStatus();
    }, [actuator.id]);

    const checkFeedingStatus = async () => {
        try {
            const response = await apiClient.get(`/feeding-logs/status?device_id=${actuator.id}`);
            setFeedingStatus(response.data.data);
        } catch (error) {
            console.error('Failed to check feeding status:', error);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    const logFeeding = async (status) => {
        try {
            await apiClient.post('/feeding-logs', {
                iot_device_id: actuator.id,
                status: status,
                notes: `Manual feeding via web interface`
            });
            await checkFeedingStatus(); // Refresh status
        } catch (error) {
            console.error('Failed to log feeding:', error);
        }
    };

    const handleToggle = async () => {
        // Prevent rapid clicking
        const now = Date.now();
        if (now - lastClickTime < 1000) { // 1 second cooldown between clicks
            return;
        }
        setLastClickTime(now);

        // Check if this is a feeding device and if feeding is allowed
        const isFeedingDevice = actuator.name.toLowerCase().includes('feed') || 
                               actuator.name.toLowerCase().includes('อาหาร') ||
                               actuator.description?.toLowerCase().includes('feed');
        
        if (isFeedingDevice && displayStatus === 'off' && !feedingStatus.canFeed) {
            showNotification('warning', `Please wait ${Math.abs(feedingStatus.nextFeedingInHours)} hours before next feeding`);
            return;
        }

        const newStatus = displayStatus === 'on' ? 'off' : 'on';
        const valueToSend = newStatus === 'on' ? 1 : 0;

        setIsLoading(true);

        try {
            // --- 1. Construct the DYNAMIC Topic --- 
            const base = import.meta.env.VITE_MQTT_TOPIC_BASE || 'farm';
            const topic = `${base}/${actuator.farm.id}/actuators/${actuator.name.toLowerCase().replace(/\s+/g, '-')}`;

            // --- 2. Construct the Message (plain ON/OFF for compatibility with MQTT Explorer/Arduino) ---
            const message = newStatus.toUpperCase(); // 'ON' or 'OFF'

            // Publish via backend (TCP MQTT on 1883)
            await apiClient.post('/mqtt/publish', { topic, message });

            // Update UI immediately
            setDisplayStatus(newStatus);

            // Log feeding if this is a feeding device and it was turned on
            if (isFeedingDevice && newStatus === 'on') {
                await logFeeding('fed');
                showNotification('success', 'Feeding completed! Next feeding in 5 hours');
            } else if (isFeedingDevice && newStatus === 'off') {
                showNotification('info', 'Feeding system stopped');
            } else {
                showNotification('success', `${actuator.name} turned ${newStatus}`);
            }

        } catch (error) {
            console.error('Failed to toggle device:', error);
            showNotification('error', `Failed to control ${actuator.name}`);
            // Revert UI state on error
            setDisplayStatus(displayStatus);
        } finally {
            setIsLoading(false);
        }
    };

    const isToggled = displayStatus === 'on';

    return (
        <>
            <Notification
                show={notification.show}
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification(prev => ({ ...prev, show: false }))}
            />
            
            <div className="bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-cyan-900/30 backdrop-blur-md rounded-xl shadow-lg border border-purple-400/20 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-lg font-semibold text-white">{actuator.name}</p>
                        <p className={`text-sm font-medium ${isToggled ? 'text-green-400' : 'text-purple-300'}`}>
                            Status: {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                        </p>
                        <p className="text-xs text-purple-400">Farm: {actuator.farm.name}</p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={handleToggle}
                            disabled={isLoading}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-transparent ${
                                isToggled ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-600'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span
                                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                                    isToggled ? 'translate-x-6' : 'translate-x-1'
                                } ${isLoading ? 'animate-pulse' : ''}`}
                            />
                            {isLoading && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            )}
                        </button>
                        {isLoading && (
                            <span className="absolute -bottom-6 left-0 right-0 text-xs text-purple-300 text-center">
                                Processing...
                            </span>
                        )}
                    </div>
                </div>

                {/* Feeding Status for feeding devices */}
                {(actuator.name.toLowerCase().includes('feed') || 
                  actuator.name.toLowerCase().includes('อาหาร') ||
                  actuator.description?.toLowerCase().includes('feed')) && (
                    <div className="mt-4">
                        <button
                            onClick={() => setShowFeedingStatus(!showFeedingStatus)}
                            className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
                            disabled={isLoading}
                        >
                            {showFeedingStatus ? 'Hide' : 'Show'} Feeding Schedule
                        </button>
                        {showFeedingStatus && (
                            <div className="mt-3">
                                <FeedingStatus deviceId={actuator.id} />
                            </div>
                        )}
                    </div>
                )}

                {/* Device description */}
                {actuator.description && (
                    <div className="mt-3 pt-3 border-t border-purple-400/20">
                        <p className="text-sm text-purple-300">{actuator.description}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default ActuatorControl;
