// /components/SignalRConnection.jsx
import React, { useState, useEffect } from 'react';
import { signalRService } from '../utils/signalRService';

const SignalRConnection = ({ children }) => {
    const [isConnecting, setIsConnecting] = useState(true);
    const [connectionError, setConnectionError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    useEffect(() => {
        let mounted = true;
        let retryTimeout;

        const connectToSignalR = async () => {
            try {
                setIsConnecting(true);
                setConnectionError(false);
                
                const connected = await signalRService.startConnection();
                
                if (!mounted) return;

                if (!connected && retryCount < MAX_RETRIES) {
                    console.log(`Connection attempt ${retryCount + 1} failed, retrying...`);
                    setRetryCount(prev => prev + 1);
                    retryTimeout = setTimeout(connectToSignalR, 2000);
                } else if (!connected) {
                    setConnectionError(true);
                }
            } finally {
                if (mounted) {
                    setIsConnecting(false);
                }
            }
        };

        connectToSignalR();

        return () => {
            mounted = false;
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
            signalRService.stopConnection();
        };
    }, [retryCount]);

    if (isConnecting) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700">
                        {retryCount > 0 
                            ? `Attempting to connect to the backend API (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})...` 
                            : 'Attempting to connect to the backend API using SignalR...'}
                    </p>
                </div>
            </div>
        );
    }

    if (connectionError) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                    <p className="text-lg font-semibold text-red-600">
                        Failed to connect to the backend API after multiple attempts.
                    </p>
                    <p className="text-gray-600">
                        Please check if the server is running and try refreshing the page.
                    </p>
                    <button 
                        onClick={() => setRetryCount(0)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default SignalRConnection;