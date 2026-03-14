import React, { useState, useEffect } from 'react';
import apiClient from '@/apiClient';
import ModernCard, { ModernCardBody } from '@/Components/ModernCard';

const FeedingStatus = ({ deviceId }) => {
    const [status, setStatus] = useState({
        latestLog: null,
        nextFeedingInHours: null,
        canFeed: true,
        nextFeedingAt: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        fetchFeedingStatus();
        const interval = setInterval(fetchFeedingStatus, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [deviceId]);

    const fetchFeedingStatus = async () => {
        try {
            const response = await apiClient.get(`/feeding-logs/status?device_id=${deviceId}`);
            setStatus(prev => ({
                ...prev,
                ...response.data.data,
                loading: false,
                error: null
            }));
        } catch (error) {
            setStatus(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to fetch feeding status'
            }));
        }
    };

    const formatTimeRemaining = (hours) => {
        if (hours === null || hours <= 0) return 'Ready to feed';
        
        const absHours = Math.abs(hours);
        const days = Math.floor(absHours / 24);
        const remainingHours = absHours % 24;
        
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
        }
        
        return `${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    };

    const getStatusColor = () => {
        if (status.error) return 'text-red-400';
        if (status.canFeed) return 'text-green-400';
        return 'text-yellow-400';
    };

    const getProgressBarColor = () => {
        if (status.error) return 'bg-gradient-to-r from-red-500 to-red-600';
        if (status.canFeed) return 'bg-gradient-to-r from-green-500 to-green-600';
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    };

    const getProgressBarWidth = () => {
        if (!status.nextFeedingInHours || status.nextFeedingInHours <= 0) return 100;
        const totalHours = 5; // 5 hours between feedings
        const remaining = Math.max(0, Math.min(totalHours, totalHours + status.nextFeedingInHours));
        return (remaining / totalHours) * 100;
    };

    if (status.loading) {
        return (
            <ModernCard variant="cosmic" className="animate-pulse">
                <ModernCardBody>
                    <div className="h-4 bg-purple-500/30 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-purple-500/20 rounded w-1/2"></div>
                </ModernCardBody>
            </ModernCard>
        );
    }

    if (status.error) {
        return (
            <ModernCard variant="error">
                <ModernCardBody>
                    <p className="text-red-300 text-sm">{status.error}</p>
                </ModernCardBody>
            </ModernCard>
        );
    }

    return (
        <ModernCard variant="cosmicGlass">
            <ModernCardBody>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-white flex items-center">
                        <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Feeding Status
                    </h4>
                    <div className={`text-sm font-medium ${getStatusColor()} flex items-center`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${status.canFeed ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
                        {status.canFeed ? 'Ready' : 'Waiting'}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="w-full bg-gray-700/50 rounded-full h-3 border border-purple-400/20">
                        <div 
                            className={`${getProgressBarColor()} h-3 rounded-full transition-all duration-500 shadow-lg`}
                            style={{ width: `${getProgressBarWidth()}%` }}
                        ></div>
                    </div>
                </div>

                {/* Time Information */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-purple-300">
                            {status.canFeed ? 'Status' : 'Next feeding in'}:
                        </span>
                        <span className={`font-medium ${getStatusColor()}`}>
                            {formatTimeRemaining(status.nextFeedingInHours)}
                        </span>
                    </div>

                    {status.latestLog && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-purple-300">
                                Last fed:
                            </span>
                            <span className="text-white">
                                {new Date(status.latestLog.fed_at).toLocaleString()}
                            </span>
                        </div>
                    )}

                    {status.nextFeedingAt && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-purple-300">
                                Next feeding:
                            </span>
                            <span className="text-white">
                                {new Date(status.nextFeedingAt).toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>
            </ModernCardBody>
        </ModernCard>
    );
};

export default FeedingStatus;
