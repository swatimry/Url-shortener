const redis = require('redis');
const client = redis.createClient();

// Connect to Redis
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

// Initialize the counter if it doesn't exist
const initializeCounter = async () => {
    try {
        // Ensure the client is connected
        if (!client.isOpen) {
            await client.connect();
        }

        // Check if the counter exists
        const counterExists = await client.exists('url_counter');

        if (counterExists === 0) { // `exists` returns 1 if the key exists, 0 otherwise
            await client.set('url_counter', 1); // Set the initial value to 1 (or 0 if you prefer)
            console.log('Counter initialized to 1');
        } else {
            console.log('Counter already initialized');
        }
    } catch (err) {
        console.error('Failed to initialize counter:', err);
    }
};


initializeCounter();


process.on('exit', () => {
    if (client.isOpen) {
        client.quit();
    }
});

module.exports = client;
