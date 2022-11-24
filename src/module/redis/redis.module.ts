import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RedisService } from './redis.service'

@Module({
  providers: [ConfigModule, RedisService],
  exports: [RedisService],
})
export class RedisModule {}

