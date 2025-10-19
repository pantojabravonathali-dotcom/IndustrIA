
import React from 'react';

export const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center py-8">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
    );
};
