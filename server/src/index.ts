import config from "./config";
import { buildServer, publisher } from "./app";
import closeWithGrace from 'close-with-grace';

const { PORT, HOST, CONNECTED_CLIENTS, CONNECTION_COUNT_KEY } = config


async function main() {
    const app = await buildServer();

    try {
        await app.listen({
            port: PORT,
            host: HOST,
        });

        closeWithGrace({ delay: 1000 }, async ({ signal, err }) => {
            if (err) {
                console.error('Error during shutdown:', err.stack || err);
            }
            try {
                if (CONNECTED_CLIENTS > 0) {
                    const currentCount = parseInt(
                        (await publisher.get(CONNECTION_COUNT_KEY)) || "0",
                        10
                    );

                    const newCount = Math.max(currentCount - CONNECTED_CLIENTS, 0);

                    await publisher.set(CONNECTION_COUNT_KEY, newCount);
                }

                await app.close();
            } catch (error) {
                console.error('Error during shutdown:', error);
            }
        });

        console.log(`Server started at http://${HOST}:${PORT}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
