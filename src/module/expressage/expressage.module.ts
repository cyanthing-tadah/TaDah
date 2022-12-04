import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ExpressageController } from './expressage.controller'
import { ExpressageService } from './expressage.service'

@Module({
  imports: [HttpModule],
  controllers: [ExpressageController],
  providers: [ExpressageService],
})
export class ExpressageModule {}
