import { app } from './app';
import config from './config/config';

const server = app.listen(config.PORT);

(() => {
    try {
        //  Database connection

        // eslint-disable-next-line no-console
        console.info(`APPLICATION_STARTED`, {
            meta: {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`APPLICATION_ERROR`, { meta: error });
        server.close((error) => {
            if (error) {
                // eslint-disable-next-line no-console
                console.error(`APPLICATION_ERROR`, { meta: error });
            }

            process.exit(1);
        });
    }
})();
