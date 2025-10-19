import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl md:text-2xl font-bold text-green-800">
                        Analizador de Residuos Orgánicos
                    </h1>
                     <p className="text-sm text-gray-500">Instituto Técnico Girardot - Túquerres</p>
                </div>
            </div>
        </header>
    );
};