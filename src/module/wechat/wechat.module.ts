import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { WechatXmlMiddleware } from '../../core/middlewares/wechat-xml.middleware'
import { MessageModule } from '../message/message.module'
import { RedisModule } from '../redis/redis.module'
import { WechatController } from './wechat.controller'
import { WechatService } from './wechat.service'

@Module({
  imports: [HttpModule, MessageModule, RedisModule],
  controllers: [WechatController],
  providers: [WechatService],
})
export class WechatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(WechatXmlMiddleware).forRoutes(WechatController)
  }
}
