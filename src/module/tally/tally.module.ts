import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TallAmountTagEntity, TallyDataListEntity } from './tally.entity'
import { TallyService } from './tally.service'

@Module({
  imports: [TypeOrmModule.forFeature([TallAmountTagEntity, TallyDataListEntity])],
  providers: [TallyService],
  exports: [TallyService],
})
export class TallyModule {}
