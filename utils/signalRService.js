// /utils/signalRService.js
import * as signalR from '@microsoft/signalr';

export class SignalRService {
    constructor() {
        this.connection = null;
        this.connected = false;
    }

    async startConnection() {
        try {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl('http://localhost:8080/messageRelayHub', {
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets
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