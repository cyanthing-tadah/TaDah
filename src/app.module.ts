import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WechatModule } from './module/wechat/wechat.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [WechatModule],
})
export class AppModule {}
