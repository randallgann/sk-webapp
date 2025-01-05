// /utils/signalRService.js
import * as signalR from '@microsoft/signalr';
import getConfig from 'next/config'


export class SignalRService {
    constructor() {
        const { publicRuntimeConfig } = getConfig()
        const envUrl = process.env.NEXT_PUBLIC_API_URL
        const configUrl = publicRuntimeConfig.API_URL
        // Add debug logging
        console.log('PublicRuntimeConfig:', publicRuntimeConfig);
        console.log('API_URL from config:', publicRuntimeConfig.API_URL);
        console.log('Environment URL:', envUrl);
        console.log('Config URL:', configUrl);
        this.connection = null;
        this.connected = false;
        this.hubUrl =  `${envUrl}/messageRelayHub` || `${publicRuntimeConfig.API_URL}/messageRelayHub` || 'http://localhost:8080/messageRelayHub';
        console.log('Final hubUrl:', this.hubUrl);
    }

    async startConnection() {
        try {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(this.hubUrl, {
                    // Remove skipNegotiation: true
                    transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
                })
                .withAutomaticReconnect({
                    nextRetryDelayInMilliseconds: retryContext => {
                        if (retryContext.elapsedMilliseconds < 60000) {
                            return 2000;
                        }
                        return null;
                    }
                })
                .configureLogging(signalR.LogLevel.Debug)
                .build();

            this.connection.onclose((error) => {
                console.log('Connection closed:', error);
                this.connected = false;
            });

            await this.connection.start();
            this.connected = true;
            console.log('SignalR Connected Successfully');
            return true;
        } catch (error) {
            console.error('SignalR Connection Error: ', error);
            this.connected = false;
            return false;
        }
    }

    isConnected() {
        return this.connected;
    }

    getConnection() {
        return this.connection;
    }

    async stopConnection() {
        if (this.connection) {
            try {
                await this.connection.stop();
                console.log('SignalR Connection Stopped');
            } catch (err) {
                console.error('Error stopping SignalR connection:', err);
            }
            this.connected = false;
        }
    }
}

// Create and export a singleton instance
export const signalRService = new SignalRService();

// Default export for backward compatibility
export default signalRService;