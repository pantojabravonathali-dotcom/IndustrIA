import React from 'react';

// Since we're using a CDN, we need to declare the `marked` variable
declare global {
    interface Window {
        marked: {
            parse: (markdown: string) => string;
        };
    }
}

interface ResultsDisplayProps {
    markdownContent: string;
}

const ICONS: { [key: string]: React.FC<{ className?: string }> } = {
    '1': ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m0 0l-2-1m2 1v2.5M3 12l2-1m0 0l2 1m-2-1v-2.5M20 12l2-1m0 0l2 1m-2-1v-2.5M4 7l2-1m0 0l2 1m-2-1v-2.5m6-3l-2-1m0 0l-2 1m2-1V.5M9 12.5l2 1m0 0l2-1m-2 1V15m3-2.5l2 1m0 0l2-1m-2 1V15m-6 0l2 1m0 0l2-1m-2 1v2.5m-3-2.5l2 1m0 0l2-1m-2 1V15" /></svg>,
    '2': ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v4.512l-1.571.785a2 2 0 01-1.858 0L8 10.012V5l-1-1z" /></svg>,
    '3': ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    '4': ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293l.707-.707a2 2 0 012.828 0l.707.707M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>,
    '5': ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5V4H4zm0 12v5h5v-5H4zM15 4v5h5V4h-5zm0 12v5h5v-5h-5z" /></svg>,
    '6': ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    '7': ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 16v-1m0-1c-1.11 0-2.08-.402-2.599-1M12 16h.01M12 16c1.657 0 3-.895 3-2s-1.343-2-3-2-3-.895-3-2 1.343-2 3-2m0 8c-1.11 0-2.08.402-2.599 1" /></svg>,
};


interface Section {
    title: string;
    content: string;
    icon: React.FC<{ className?: string }>;
}

const parseMarkdown = (markdown: string): Section[] => {
    if (!markdown) return [];
    
    // Split by H2 headers (##)
    const sections = markdown.split(/\n## /).filter(s => s.trim() !== '');
    
    return sections.map(sectionText => {
        const firstNewline = sectionText.indexOf('\n');
        const title = sectionText.substring(0, firstNewline).replace(/^\d+\.\s*/, '').trim();
        const content = sectionText.substring(firstNewline + 1).trim();
        const sectionNumber = sectionText.trim().charAt(0);
        const Icon = ICONS[sectionNumber] || ICONS['1'];
        
        const htmlContent = window.marked ? window.marked.parse(content) : content;

        return { title, content: htmlContent, icon: Icon };
    }).filter(s => s.title && s.content);
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ markdownContent }) => {
    const sections = parseMarkdown(markdownContent);

    if (sections.length === 0) {
        return <p>No se pudo procesar la respuesta.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                    <div 
                        key={index} 
                        className="bg-white/70 rounded-xl shadow-md border border-green-200/50 p-6 transition-transform transform hover:scale-[1.02] hover:shadow-lg"
                    >
                        <div className="flex items-center mb-4">
                            <div className="bg-green-100 p-3 rounded-full mr-4">
                               <Icon className="w-6 h-6 text-green-700" />
                            </div>
                            <h2 className="text-xl font-bold text-green-800">{section.title}</h2>
                        </div>
                        <div
                            className="prose prose-sm max-w-none text-gray-700 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-strong:text-gray-800"
                            dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                    </div>
                );
            })}
        </div>
    );
};