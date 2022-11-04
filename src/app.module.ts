import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import weixinAccountConfig from './config/wexin_account'
import MySqlConfig from './config/db.config'
import { WechatModule } from './module/wechat/wechat.module'
import { AccountModule } from './module/account/account.module'

const { MYSQL_PORT, MYSQL_PASSWORD, MYSQL_USERNAME, MYSQL_HOST, MYSQL_DATABASE_NAME } = MySqlConfig()
const LOCAL_DB_CONFIG = { type: 'mysql', port: MYSQL_PORT, username: MYSQL_USERNAME, password: MYSQL_PASSWORD, host: MYSQL_HOST, database: MYSQL_DATABASE_NAME, synchronize: false, entities: [`${__dirname}/**/*.entity{.ts,.js}`] }

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [weixinAccountConfig] }),
    TypeOrmModule.forRoot(LOCAL_DB_CONFIG),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    WechatModule,
    AccountModule,
  ],
})
export class AppModule {}

