"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { 
    FiChevronLeft, 
    FiChevronRight, 
    FiZoomIn, 
    FiZoomOut, 
    FiMaximize2, 
    FiMinimize2,
    FiX,
    FiRotateCw
} from 'react-icons/fi';

// Set up worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function EbookReader({ fileUrl, onClose, title = "ই-বুক রিডার" }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rotation, setRotation] = useState(0);
    const containerRef = useRef(null);

    // Security: Prevent context menu (right click)
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    // Security: Prevent common shortcuts (Ctrl+P, Ctrl+S, Ctrl+U, F12)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u')) ||
                e.key === 'F12'
            ) {
                e.preventDefault();
                return false;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setIsLoading(false);
    };

    const onDocumentLoadError = (err) => {
        console.error('PDF Load Error:', err);
        setError('বইটি লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
        setIsLoading(false);
    };

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => {
            const next = prevPageNumber + offset;
            if (next >= 1 && next <= numPages) return next;
            return prevPageNumber;
        });
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
    const rotate = () => setRotation(prev => (prev + 90) % 360);

    return (
        <div 
            ref={containerRef}
            className={`fixed inset-0 z-[9999] flex flex-col bg-[#1a1a1a] text-white select-none`}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Header / Toolbar */}
            <div className="h-14 bg-[#262626] border-b border-white/10 flex items-center justify-between px-4 md:px-6 shrink-0">
                <div className="flex items-center gap-3 overflow-hidden">
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
                        title="বন্ধ করুন"
                    >
                        <FiX size={20} />
                    </button>
                    <h2 className="text-sm md:text-base font-bold truncate opacity-90">{title}</h2>
                </div>

                <div className="flex items-center gap-1 md:gap-4">
                    <div className="flex items-center bg-black/30 rounded-lg px-2 py-1 gap-1">
                        <button onClick={zoomOut} className="p-1.5 hover:bg-white/10 rounded transition-colors">
                            <FiZoomOut size={18} />
                        </button>
                        <span className="text-xs font-mono w-10 text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={zoomIn} className="p-1.5 hover:bg-white/10 rounded transition-colors">
                            <FiZoomIn size={18} />
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-1">
                        <button onClick={rotate} className="p-2 hover:bg-white/10 rounded transition-colors" title="ঘুরিয়ে নিন">
                            <FiRotateCw size={18} />
                        </button>
                        <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded transition-colors">
                            {isFullscreen ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-[#121212] flex justify-center p-4 md:p-8 custom-scrollbar">
                <div className="relative shadow-2xl shadow-black/50">
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] z-10">
                            <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4"></div>
                            <p className="text-sm text-gray-400">বইটি লোড হচ্ছে...</p>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] z-10 text-center px-6">
                            <p className="text-red-400 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-brand-green rounded-full font-bold"
                            >
                                পুনরায় চেষ্টা করুন
                            </button>
                        </div>
                    )}

                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                    >
                        <Page 
                            pageNumber={pageNumber} 
                            scale={scale} 
                            rotate={rotation}
                            renderAnnotationLayer={false}
                            renderTextLayer={false} // Disable text selection for security
                            className="bg-white"
                        />
                    </Document>

                    {/* Watermark Overlay (Optional deterent) */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden select-none">
                        <p className="text-6xl font-black rotate-[-45deg] whitespace-nowrap">
                            Tarunya Prokashon • Tarunya Prokashon • Tarunya Prokashon
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer / Pagination */}
            <div className="h-16 bg-[#262626] border-t border-white/10 flex items-center justify-center px-4 shrink-0">
                <div className="flex items-center gap-4 bg-black/20 rounded-full px-4 py-2 border border-white/5">
                    <button 
                        onClick={() => changePage(-1)} 
                        disabled={pageNumber <= 1}
                        className={`p-2 rounded-full transition-colors ${pageNumber <= 1 ? 'text-gray-600' : 'hover:bg-white/10 text-white'}`}
                    >
                        <FiChevronLeft size={24} />
                    </button>
                    
                    <div className="flex items-center gap-2 min-w-[80px] justify-center">
                        <span className="text-sm font-bold">{pageNumber}</span>
                        <span className="text-xs text-gray-500">/</span>
                        <span className="text-sm text-gray-400">{numPages || '...'}</span>
                    </div>

                    <button 
                        onClick={() => changePage(1)} 
                        disabled={pageNumber >= numPages}
                        className={`p-2 rounded-full transition-colors ${pageNumber >= numPages ? 'text-gray-600' : 'hover:bg-white/10 text-white'}`}
                    >
                        <FiChevronRight size={24} />
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                /* Prevent text selection and image dragging */
                canvas {
                    user-select: none !important;
                    -webkit-user-drag: none !important;
                }
            `}</style>
        </div>
    );
}
