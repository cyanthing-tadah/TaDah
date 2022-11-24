import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import type { Cluster, RedisOptions } from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(RedisService.name)
  private redis: Cluster | Redis

  onModuleInit() {
    console.log(this.configService.get<string>('NODE_ENV'))
    console.log(this.configService.get<string>('SERVER_IP'))
    // const host = this.configService.get<string>('NODE_ENV') === 'local' ? 'localhost' : this.configService.get<string>('SERVER_IP')
    // this.redis = new Redis({ host, port: 6379 } as RedisOptions)
    // this.logger.log('finish redis connect', 'Redis')
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
   * 获取指定的 key 的值
   * @param key
   */
  async getValue(key: string) {
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
