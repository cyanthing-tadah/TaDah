import { Module } from '@nestjs/common'
import { AccountModule } from '../account/account.module'
import { TallyModule } from '../tally/tally.module'
import { MessageService } from './message.service'

@Module({
  imports: [AccountModule, TallyModule],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
