import dotenv from 'dotenv';

dotenv.config();

interface Config {
    PORT: number,
    CORS_ORIGIN: string,
    HOST: string
    UPSTASH_REDIS_REST_URL: string,
    CONNECTED_CLIENTS: number,
    CONNECTION_COUNT_KEY: string,
    CONNECTION_COUNT_UPDATED_CHANNEL: string,
    NEW_MESSAGE_CHANNEL: string,
    MESSAGES_KEY: string
}

const config: Config = {
    PORT: parseInt(process.env.PORT || "3001", 10),
    HOST: process.env.HOST || "0.0.0.0",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
    UPSTASH_REDIS_REST_URL: String(process.env.UPSTASH_REDIS_REST_URL),
    CONNECTED_CLIENTS: 0,
    CONNECTION_COUNT_KEY: "chat:connection-count",
    CONNECTION_COUNT_UPDATED_CHANNEL: "chat:connection-count-updated",
    NEW_MESSAGE_CHANNEL: "chat:new-message",
    MESSAGES_KEY: "chat:messages"
};

export default config;
