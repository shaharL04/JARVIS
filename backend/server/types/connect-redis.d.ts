declare module 'connect-redis' {
    import { Store } from 'express-session';
    import { RedisClient } from 'redis';

    interface ConnectRedisOptions {
        client: RedisClient;
        // Add any additional options if needed
    }

    function connectRedis(session: any): new (options: ConnectRedisOptions) => Store;

    export = connectRedis;
}