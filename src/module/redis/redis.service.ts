import Redis from 'ioredis'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import type { Cluster, RedisOptions } from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name)
  private redis: Cluster | Redis

  onModuleInit() {
    this.redis = new Redis({ host: 'localhost', port: 6379 } as RedisOptions)
    this.logger.log('finish redis connect', 'Redis')
  }

  /**
   * 设置 redis 缓存
   * @param key
   * @param value
   * @param ex
   */
  async setValue(key: string, value: string, ex?: number) {
    if (ex) {
      await this.redis.set(key, value, 'EX', ex)
    }
    else {
      await this.redis.set(key, value)
    }
  }

  /**
   * 清除指定缓存
   * @param key
   */
  async deleteValue(key: string) {
    await this.redis.set(key, null)
  }
}
