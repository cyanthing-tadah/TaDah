import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExpressageController } from './expressage.controller'
import { ExpressRecordInfoEntity } from './expressage.entity'
import { ExpressageService } from './expressage.service'

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ExpressRecordInfoEntity])],
  controllers: [ExpressageController],
  providers: [ExpressageService],
})
export class ExpressageModule {}
