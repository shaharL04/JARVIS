
import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

async function connectRedis() {
  try {
    redisClient = createClient();
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
}

export { redisClient, connectRedis };
