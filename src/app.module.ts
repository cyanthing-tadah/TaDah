import { Module } from '@nestjs/common'
import { WechatModule } from './module/wechat/wechat.module'
import { AccountModule } from './module/account/account.module'

@Module({
  imports: [WechatModule, AccountModule],
})
export class AppModule {}

