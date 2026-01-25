'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Upload, Camera, Loader2, AlertCircle, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ScannerModal({ isOpen, onClose, onScan }) {
    const [mode, setMode] = useState('camera'); // 'camera' | 'upload'
    const [error, setError] = useState('');
    const [scanning, setScanning] = useState(false);
    const router = useRouter();
    const routerRef = useRef(router); // Stable ref for callback
    const scannerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Keep router ref updated
    useEffect(() => {
        routerRef.current = router;
    }, [router]);

    // Handle Success
    const onScanSuccess = (decodedText) => {
        // Stop scanning
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                scannerRef.current.clear();
            }).catch(console.error);
        }

        // Custom callback or Default Redirect
        if (onScan) {
            onScan(decodedText);
            onClose();
            return;
        }

        // Parse URL to get ID
        // Expected format: https://farmchain.com/verify/BATCH_ID
        // or just BATCH_ID
        let batchId = decodedText;
        if (decodedText.includes('/verify/')) {
            const parts = decodedText.split('/verify/');
            batchId = parts[1];
        }

        if (batchId) {
            onClose();
            routerRef.current.push(`/verify/${batchId}`);
        } else {
            setError('Invalid QR Code format');
        }
    };

    // Initialize Camera
    useEffect(() => {
        if (isOpen && mode === 'camera') {
            setScanning(true);
            setError('');
            
            // Cleanup previous instance if any (safety check)
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().then(() => scannerRef.current.clear());
            }

            const scanner = new Html5Qrcode("reader");
            scannerRef.current = scanner;
            
            const config = { 
                fps: 5, 
                qrbox: { width: 220, height: 220 },
                aspectRatio: 1.0
            };
            
            // Wait for animation to finish ensuring DOM is ready
            const timer = setTimeout(() => {
                scanner.start(
                    { facingMode: "environment" }, 
                    config, 
                    onScanSuccess,
                    (errorMessage) => {
                        // ignore frame errors
                    }
                ).catch(err => {
                    console.error("Scanner failed to start", err);
                    setScanning(false);
                    setError('Camera access failed. Please ensure permissions are granted.');
                });
            }, 500); // Increased to 500ms to be safe with Framer Motion

            return () => {
                clearTimeout(timer);
                if (scanner.isScanning) {
                    scanner.stop().then(() => scanner.clear()).catch(console.error);
                }
            };
        }
    }, [isOpen, mode]);

    // Cleanup on unmount/close
    useEffect(() => {
        if (!isOpen && scannerRef.current) {
            // Clean cleanup
            const scanner = scannerRef.current;
            if (scanner.isScanning) {
                scanner.stop().then(() => scanner.clear()).catch(e => console.warn(e));
            }
        }
    }, [isOpen]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const scanner = new Html5Qrcode("reader-upload");
        scanner.scanFile(file, true)
            .then(decodedText => {
                onScanSuccess(decodedText);
            })
            .catch(err => {
                setError('Could not read QR code. Please ensure it is clear.');
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-stone-900 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl border border-stone-800"
            >
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-stone-800">
                    <h2 className="text-stone-200 font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                        <ScanLine className="w-4 h-4 text-emerald-500" />
                        Scan Product
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="relative">
                    {/* Error Toast */}
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-4 left-4 right-4 z-20 bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-xl text-xs flex items-center gap-2 backdrop-blur-md"
                            >
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {mode === 'camera' && (
                        <div className="relative aspect-square bg-black">
                             <div id="reader" className="w-full h-full [&>video]:object-cover" />
                             {/* Custom Overlay */}
                             <div className="absolute inset-0 pointer-events-none border-[30px] border-black/50">
                                 <div className="w-full h-full border-2 border-emerald-500/50 rounded-lg relative overflow-hidden">
                                     <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                                     <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                                     <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                                     <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />
                                     
                                     {/* Scanning Line */}
                                     {scanning && (
                                         <motion.div 
                                            className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                                            initial={{ y: 0 }}
                                            animate={{ y: 220 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                         />
                                     )}
                                 </div>
                             </div>
                        </div>
                    )}

                    {mode === 'upload' && (
                        <div className="aspect-square bg-stone-900 flex flex-col justify-center p-6">
                            <div id="reader-upload" className="hidden"></div>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-stone-700 rounded-2xl h-full flex flex-col items-center justify-center cursor-pointer hover:bg-stone-800 hover:border-emerald-500/50 transition-all group"
                            >
                                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-stone-300 font-bold mb-1 text-sm">Upload QR Image</h3>
                                <p className="text-xs text-stone-500">Click to browse</p>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="flex border-t border-stone-800 divide-x divide-stone-800">
                    <button 
                        onClick={() => setMode('camera')}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${mode === 'camera' ? 'bg-emerald-600 text-white' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800'}`}
                    >
                        <Camera className="w-4 h-4" /> Camera
                    </button>
                    <button 
                        onClick={() => setMode('upload')}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${mode === 'upload' ? 'bg-emerald-600 text-white' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800'}`}
                    >
                        <Upload className="w-4 h-4" /> Upload
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
