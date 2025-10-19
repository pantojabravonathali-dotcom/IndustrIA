import { GoogleGenAI } from "@google/genai";
import type { FilePart } from '../types';

if (!process.env.API_KEY) {
    throw new Error("Missing API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (text: string): string => {
    const basePrompt = `
    Actúa como un experto de clase mundial en gestión de residuos, agronomía y ciencias ambientales.
    Tu tarea es proporcionar información detallada, precisa y bien estructurada sobre el siguiente residuo orgánico.
    
    Responde exclusivamente en español.

    Primero, inicia tu respuesta con un título principal (formato H1 de Markdown, o sea #) que contenga el nombre común del residuo y, si es posible, su nombre científico entre paréntesis.

    Después de este título, organiza la información EXACTAMENTE en las siguientes siete secciones, usando el formato Markdown. Usa títulos H2 (##) para cada sección y viñetas para las listas. Sé exhaustivo y profesional en tu respuesta.

    ## 1. Composición Aproximada
    - Detalla los componentes principales (ej. celulosa, lignina, azúcares, proteínas, etc.) en porcentajes si es posible.

    ## 2. Propiedades Físicas y Químicas
    - Describe características como humedad, densidad, pH, relación Carbono/Nitrógeno (C/N), etc.

    ## 3. Usos y Aplicaciones Posibles
    - Enumera y describe diversas alternativas de aprovechamiento como compostaje, producción de biogás, alimentación animal, biofertilizantes, etc.

    ## 4. Impacto Ambiental
    - Explica el impacto tanto positivo (si se gestiona bien) como negativo (si se desecha incorrectamente, ej. producción de metano en vertederos).

    ## 5. Métodos de Aprovechamiento y Reciclaje
    - Describe con más detalle las tecnologías o procesos para cada uno de los usos mencionados en el punto 3 (ej. compostaje en pilas, biodigestión anaeróbica, etc.).

    ## 6. Producción y Utilización en Colombia
    - Proporciona una estimación de la cantidad de este residuo que se genera anualmente en Colombia y qué porcentaje aproximado se aprovecha actualmente. Si no hay datos específicos para el residuo, ofrece una estimación basada en residuos similares o en el sector agrícola/industrial correspondiente.

    ## 7. Posibles Costos de Producción
    - Para cada una de las alternativas del punto 3, ofrece una estimación general de los costos de implementación o producción (ej. costo por tonelada de compost producido, costo de instalación de un biodigestor, etc.). Puedes usar rangos de precios o clasificaciones como 'bajo', 'medio', 'alto'.
    `;

    if (text) {
        return `${basePrompt}\n\nEl residuo a analizar es: **${text}**.`;
    }
    return `${basePrompt}\n\nAnaliza el residuo que se muestra en la imagen.`;
};


export const getWasteInfo = async (text: string, image?: FilePart): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const prompt = buildPrompt(text);

    try {
        const contents = image 
            ? { parts: [ {text: prompt}, image ] }
            : prompt;

        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("No se pudo obtener una respuesta del modelo de IA. Revisa la consola para más detalles.");
    }
};