import { join } from 'path'
import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { WechatModule } from './module/wechat/wechat.module'
import { AccountModule } from './module/account/account.module'

@Module({
  imports: [
    WechatModule,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    AccountModule,
  ],
})
export class AppModule {}

