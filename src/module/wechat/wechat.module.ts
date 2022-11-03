import { Module } from '@nestjs/common'
import { AccountModule } from '../account/account.module'
import { WechatController } from './wechat.controller'
import { WechatService } from './wechat.service'

@Module({
  imports: [AccountModule],
  controllers: [WechatController],
  providers: [WechatService],
})
export class WechatModule {}
