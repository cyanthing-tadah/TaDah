import { Module } from '@nestjs/common'
import { AccountModule } from '../account/account.module'
import { MessageService } from './message.service'

@Module({
  imports: [AccountModule],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
