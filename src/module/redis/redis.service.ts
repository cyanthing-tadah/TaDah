import Redis from 'ioredis'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import type { Cluster } from 'ioredis'
import { handleRedisConfig } from '../../helper'

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name)
  private redis: Cluster | Redis

  onModuleInit() {
    this.redis = new Redis(handleRedisConfig())
    this.logger.log('finish redis connect', 'Redis')
  }

  /**
   * 设置 redis 缓存
   * @param key
   * @param value
   * @param ex
   */
  setValue(key: string, value: string, ex?: number) {
    if (ex) {
      this.redis.set(key, value, 'EX', ex, () => {
        this.logger.log(`set ${key} success`)
      })
    }
    else {
      this.redis.set(key, value, () => {
        this.logger.log(`set ${key} success`)
      })
    }
  }

  /**
   * 获取指定的 key 的值
   * @param key
   */
  getValue(key: string) {
    return this.redis.get(key)
  }

  /**
   * 清除指定缓存
   * @param key
   */
  async deleteValue(key: string) {
    await this.redis.set(key, null)
  }
}
