import fastify from 'fastify';
import fastifyCors from "@fastify/cors";
import fastifyIO from "fastify-socket.io";
import { Server } from "socket.io";
import config from "./config";
import { Redis } from 'ioredis';
import { randomUUID } from 'crypto';

declare module "fastify" {
    interface FastifyInstance {
        io: Server<any>;
    }
}

const {
    PORT,
    CORS_ORIGIN,
    CONNECTION_COUNT_KEY,
    CONNECTION_COUNT_UPDATED_CHANNEL,
    UPSTASH_REDIS_REST_URL,
    NEW_MESSAGE_CHANNEL,
} = config;


if (!UPSTASH_REDIS_REST_URL) {
    console.error("UPSTASH_REDIS_REST_URL is not defined");
    process.exit(1);
}

const publisher = new Redis(UPSTASH_REDIS_REST_URL);
const subscriber = new Redis(UPSTASH_REDIS_REST_URL);

// Publisher will publish to a channel 
// and the subscriber will listen to this channel

async function buildServer() {
    const app = fastify();

    await app.register(fastifyCors, {
        origin: CORS_ORIGIN,
    });

    await app.register(fastifyIO);

    const currentCount = await publisher.get(CONNECTION_COUNT_KEY);

    if (!currentCount) {
        await publisher.set(CONNECTION_COUNT_KEY, 0);
    }

    app.ready(() => {
        app.io.on("connection", async (socket) => {
            console.info("Client connected!")

            config.CONNECTED_CLIENTS++;
            console.log("Connected clients: ", config.CONNECTED_CLIENTS)

            let newCount: number;
            newCount = await publisher.incr(CONNECTION_COUNT_KEY);

            await publisher.publish(CONNECTION_COUNT_UPDATED_CHANNEL, String(newCount));

            socket.on(NEW_MESSAGE_CHANNEL, async ({ message }: { message: string }) => {
                await publisher.publish(NEW_MESSAGE_CHANNEL, message.toString());
            })

            socket.on("disconnect", async () => {
                console.info("Client disconnected!")
                newCount = await publisher.decr(CONNECTION_COUNT_KEY);

                await publisher.publish(CONNECTION_COUNT_UPDATED_CHANNEL, String(newCount));
            })
        })
    });

    subscriber.subscribe(CONNECTION_COUNT_UPDATED_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${CONNECTION_COUNT_UPDATED_CHANNEL}`, err);
            return;
        }

        console.info(`${count} clients subscribed! to ${CONNECTION_COUNT_UPDATED_CHANNEL}`);
    });

    subscriber.subscribe(NEW_MESSAGE_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${NEW_MESSAGE_CHANNEL}`, err);
            return;
        }

        console.info(`${count} clients subscribed! to ${NEW_MESSAGE_CHANNEL}`);
    })

    subscriber.on("message", (channel, message) => {
        if (channel === CONNECTION_COUNT_UPDATED_CHANNEL) {
            app.io.emit(CONNECTION_COUNT_UPDATED_CHANNEL, {
                count: message,
            });
            return;
        }
        if (channel === NEW_MESSAGE_CHANNEL) {
            app.io.emit(NEW_MESSAGE_CHANNEL, {
                id: randomUUID(),
                message,
                createdAt: new Date(),
                port: PORT,
            })
            return;
        }

    })

    app.get("/healthcheck", () => {
        return {
            status: "ok",
            port: PORT,
        }
    })

    return app;
}

export {
    buildServer,
    publisher,
};