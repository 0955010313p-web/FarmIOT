import mqtt from 'mqtt';

const enabled = (import.meta.env.VITE_MQTT_ENABLE || 'false') === 'true';
const host = import.meta.env.VITE_MQTT_HOST || '127.0.0.1';
const port = parseInt(import.meta.env.VITE_MQTT_PORT || '1883', 10);
const username = import.meta.env.VITE_MQTT_USERNAME || '';
const password = import.meta.env.VITE_MQTT_PASSWORD || '';
const protocol = import.meta.env.VITE_MQTT_PROTOCOL || 'ws';

const options = {
    host,
    port,
    protocol,
    username,
    password,
    reconnectPeriod: 1000,
};

class MqttService {
    constructor() {
        this.client = null;
        if (enabled) {
            this.connect();
        } else {
            console.info('MQTT disabled (set VITE_MQTT_ENABLE=true to enable).');
        }
    }

    connect() {
        if (!enabled) {
            return;
        }
        if (!this.client || !this.client.connected) {
            this.client = mqtt.connect(`${protocol}://${host}:${port}`, options);

            this.client.on('connect', () => {
                console.log('Successfully connected to MQTT broker');
            });

            this.client.on('error', (err) => {
                console.error('MQTT Connection Error:', err);
                // Back off by stopping automatic reconnect if credentials/host are wrong
                this.client.end(true);
                this.client = null;
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
            // Reduce console noise when disabled or not connected
            if (enabled) {
                console.warn('MQTT client not connected. Cannot subscribe.');
            }
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
            if (enabled) {
                console.warn('MQTT client not connected. Cannot publish.');
            }
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
