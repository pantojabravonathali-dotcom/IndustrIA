import React, { useRef } from 'react';

interface InputAreaProps {
    inputText: string;
    onTextChange: (text: string) => void;
    onImageChange: (file: File | null) => void;
    onSubmit: () => void;
    isLoading: boolean;
    imagePreviewUrl: string | null;
}

const SearchIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ImageIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const CameraIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const InputArea: React.FC<InputAreaProps> = ({
    inputText,
    onTextChange,
    onImageChange,
    onSubmit,
    isLoading,
    imagePreviewUrl,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onImageChange(file);
        if (event.target) {
            event.target.value = ''; // Allows re-selecting the same file
        }
    };

    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleCameraButtonClick = () => {
        cameraInputRef.current?.click();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !isLoading) {
            onSubmit();
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-center text-gray-600">Ingresa el nombre del residuo orgánico o usa una imagen para analizarlo.</p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => onTextChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ej: cáscara de plátano, borra de café..."
                    className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow disabled:bg-gray-100"
                    disabled={isLoading}
                />
                <span className="text-gray-500 font-semibold hidden sm:block">Ó</span>
                 <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                        disabled={isLoading}
                    />
                     <input
                        type="file"
                        ref={cameraInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                        capture="environment"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleUploadButtonClick}
                        disabled={isLoading}
                        className="w-full sm:w-auto flex items-center justify-center px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Subir Imagen
                    </button>
                    <button
                        onClick={handleCameraButtonClick}
                        disabled={isLoading}
                        className="w-full sm:w-auto flex items-center justify-center px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        <CameraIcon className="w-5 h-5 mr-2" />
                        Tomar Foto
                    </button>
                </div>
            </div>
            
            {imagePreviewUrl && (
                <div className="mt-4 text-center">
                    <p className="font-semibold mb-2">Vista previa de la imagen:</p>
                    <div className="relative inline-block">
                         <img src={imagePreviewUrl} alt="Preview" className="max-w-xs mx-auto rounded-lg shadow-md" />
                         <button
                            onClick={() => onImageChange(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 leading-none hover:bg-red-600 focus:outline-none"
                            aria-label="Remove image"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                         </button>
                    </div>
                </div>
            )}
            
            <div className="pt-4 flex justify-center">
                 <button
                    onClick={onSubmit}
                    disabled={isLoading || (!inputText && !imagePreviewUrl)}
                    className="flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
                >
                    {isLoading ? 'Analizando...' : <><SearchIcon className="w-5 h-5 mr-2" /> Analizar Residuo</>}
                </button>
            </div>
        </div>
    );
};