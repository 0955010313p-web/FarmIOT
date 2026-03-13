import mqtt from 'mqtt';

// --- MQTT Connection Options ---
const options = {
    host: 'comsci2.srru.ac.th',
    port: 1883,
    protocol: 'ws', // Use 'ws' for frontend connections, 'mqtt' for backend
    username: 'cssrru',
    password: 'good2cu*99',
    reconnectPeriod: 1000, // Try to reconnect every second if connection is lost
};

class MqttService {
    constructor() {
        this.client = null;
        this.connect();
    }

    connect() {
        if (!this.client || !this.client.connected) {
            console.log('Attempting to connect to MQTT broker...');
            this.client = mqtt.connect(`ws://${options.host}:${options.port}`, options);

            this.client.on('connect', () => {
                console.log('Successfully connected to MQTT broker');
            });

            this.client.on('error', (err) => {
                console.error('MQTT Connection Error:', err);
                this.client.end(); // Close the connection on error
            });

            this.client.on('reconnect', () => {
                console.log('Reconnecting to MQTT broker...');
            });

            this.client.on('close', () => {
                console.log('MQTT connection closed.');
            });
        }
    }

    subscribe(topic, onMessageCallback) {
        if (this.client && this.client.connected) {
            this.client.subscribe(topic, (err) => {
                if (!err) {
                    console.log(`Subscribed to topic: ${topic}`);
                    this.client.on('message', (receivedTopic, message) => {
                        // Ensure the callback is only fired for the subscribed topic
                        if (receivedTopic === topic) {
                            onMessageCallback(message.toString());
                        }
                    });
                } else {
                    console.error(`Subscription Error for topic ${topic}:`, err);
                }
            });
        } else {
            console.warn('MQTT client not connected. Cannot subscribe.');
        }
    }

    publish(topic, message) {
        if (this.client && this.client.connected) {
            this.client.publish(topic, message, (err) => {
                if (err) {
                    console.error('MQTT Publish Error:', err);
                }
            });
        } else {
            console.warn('MQTT client not connected. Cannot publish.');
        }
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            this.client = null;
        }
    }
}

// Export a singleton instance
const mqttService = new MqttService();
export default mqttService;
