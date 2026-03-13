import React from 'react';

const SensorCard = ({ icon, label, value, unit }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between">
            <div className="flex items-center">
                <div className="mr-4 text-indigo-500 dark:text-indigo-400">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {value} <span className="text-lg font-normal">{unit}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SensorCard;
