import { Module } from '@nestjs/common'
import { WechatModule } from './module/wechat/wechat.module'

@Module({
  imports: [WechatModule],
})
export class AppModule {}

