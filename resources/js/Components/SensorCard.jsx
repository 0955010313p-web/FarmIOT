import React from 'react';
import ModernCard, { ModernCardBody } from '@/Components/ModernCard';

const SensorCard = ({ icon, label, value, unit }) => {
    return (
        <ModernCard variant="cosmic" hover={true}>
            <ModernCardBody>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="mr-4 text-purple-400">
                            {icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-purple-300">{label}</p>
                            <p className="text-2xl font-bold text-white">
                                {value} <span className="text-lg font-normal text-purple-200">{unit}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </ModernCardBody>
        </ModernCard>
    );
};

export default SensorCard;
