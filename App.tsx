import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { getWasteInfo } from './services/geminiService';
import { InitialContent } from './components/InitialContent';
import type { FilePart } from './types';

declare global {
    interface Window {
        marked: {
            parse: (markdown: string) => string;
        };
    }
}

const App: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<string | null>(null);
    const [resultTitle, setResultTitle] = useState<string | null>(null);

    const fileToGenerativePart = async (file: File): Promise<FilePart> => {
        const base64EncodedDataPromise = new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result.split(',')[1]);
                }
            };
            reader.readAsDataURL(file);
        });
        const data = await base64EncodedDataPromise;
        return {
            inlineData: {
                data,
                mimeType: file.type,
            },
        };
    };

    const handleImageChange = (file: File | null) => {
        if (file) {
            setImageFile(file);
            setInputText(''); // Clear text input when image is selected
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };
    
    const handleTextChange = (text: string) => {
        setInputText(text);
        if (text && imageFile) {
            setImageFile(null);
            setImagePreview(null);
        }
    }

    const handleSubmit = useCallback(async () => {
        if (!inputText && !imageFile) {
            setError('Por favor, ingresa el nombre de un residuo o sube una imagen.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults(null);
        setResultTitle(null);

        try {
            let imagePart: FilePart | undefined = undefined;
            if (imageFile) {
                imagePart = await fileToGenerativePart(imageFile);
            }

            const response = await getWasteInfo(inputText, imagePart);
            
            const trimmedResponse = response.trim();
            const responseLines = trimmedResponse.split('\n');
            let title: string | null = null;
            let body = trimmedResponse;

            if (responseLines.length > 0 && responseLines[0].startsWith('# ')) {
                title = responseLines[0].substring(2).trim();
                body = responseLines.slice(1).join('\n').trim();
            }
            
            setResultTitle(title);
            setResults(body);

        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(`Error al contactar la API de Gemini: ${e.message}`);
            } else {
                setError('Ocurrió un error desconocido.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [inputText, imageFile]);

    return (
        <div className="min-h-screen text-gray-800 font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-green-200/50">
                    <InputArea
                        inputText={inputText}
                        onTextChange={handleTextChange}
                        onImageChange={handleImageChange}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        imagePreviewUrl={imagePreview}
                    />

                    <div className="mt-8 min-h-[200px]">
                        {isLoading && <Loader />}
                        {error && <ErrorMessage message={error} />}
                        {results !== null && (
                            <>
                                {resultTitle && <h2 className="text-3xl font-bold text-center mb-6 text-green-900" dangerouslySetInnerHTML={{ __html: window.marked.parse(resultTitle).replace(/^<p>|<\/p>$/g, '') }}></h2>}
                                {results && <ResultsDisplay markdownContent={results} />}
                            </>
                        )}
                        {!isLoading && !error && results === null && <InitialContent />}
                    </div>
                </div>
            </main>
            <footer className="text-center p-6 mt-8 text-sm text-green-800">
                 <p className="font-semibold">
                    Un proyecto del Instituto Técnico Girardot de Túquerres.
                </p>
                <p className="mb-2">
                    Visita nuestra tienda de productos <a href="https://industria.rdi.store/products" target="_blank" rel="noopener noreferrer" className="font-bold text-green-600 hover:underline">"IndustrIA"</a>.
                </p>
                <p className="text-xs text-gray-500">
                    Desarrollado con React, Tailwind CSS y la API de Google Gemini.
                </p>
            </footer>
        </div>
    );
};

export default App;