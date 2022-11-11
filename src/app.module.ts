import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import { WechatModule } from './module/wechat/wechat.module'
import { AccountModule } from './module/account/account.module'

const LOCAL_DB_CONFIG = { type: 'mysql', host: 'localhost', username: 'root', password: 'TaDah_password123', port: 3306, database: 'tadah' }
const PROD_DB_CONFIG = { type: 'mysql', port: process.env.MYSQL_PORT, username: process.env.MYSQL_USERNAME, password: process.env.MYSQL_PASSWORD, host: process.env.MYSQL_HOST, database: process.env.MYSQL_DATABASE_NAME }
const DB_CONFIG = process.env.NODE_ENV === 'prod' ? PROD_DB_CONFIG : LOCAL_DB_CONFIG

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...DB_CONFIG, synchronize: false, entities: [`${__dirname}/**/*.entity{.ts,.js}`] }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '.', 'public') }),
    WechatModule,
    AccountModule,
  ],
})
export class AppModule {}

