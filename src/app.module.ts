import { join } from 'path'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MySqlConfig } from './config/db.config'
import { WechatModule } from './module/wechat/wechat.module'
import { AccountModule } from './module/account/account.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...MySqlConfig, synchronize: true, entities: [`${__dirname}/**/*.entity{.ts,.js}`] }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    WechatModule,
    AccountModule,
  ],
})
export class AppModule {}

