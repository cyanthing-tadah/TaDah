import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import { WechatModule } from './module/wechat/wechat.module'
import { AccountModule } from './module/account/account.module'
import { MessageModule } from './module/message/message.module'
import { TallyModule } from './module/tally/tally.module'
import { handleDBConfig } from './helper'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...handleDBConfig(), synchronize: true, entities: [`${__dirname}/**/*.entity{.ts,.js}`] }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, 'static') }),
    WechatModule,
    AccountModule,
    MessageModule,
    TallyModule,
  ],
  providers: [],
})
export class AppModule {}

