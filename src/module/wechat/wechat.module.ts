import { Module } from '@nestjs/common'
import { MessageModule } from '../message/message.module'
import { WechatController } from './wechat.controller'
import { WechatService } from './wechat.service'

@Module({
  imports: [MessageModule],
  controllers: [WechatController],
  providers: [WechatService],
})
export class WechatModule {}
