import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WexinUserAccountEntity } from '../account/account.entity'
import { TallAmountTagEntity, TallyDataListEntity, TallyMonthDataEntity } from './tally.entity'
import { TallyService } from './tally.service'

@Module({
  imports: [TypeOrmModule.forFeature([
    TallAmountTagEntity,
    TallyDataListEntity,
    WexinUserAccountEntity,
    TallyMonthDataEntity]),
  ],
  providers: [TallyService],
  exports: [TallyService],
})
export class TallyModule {}
