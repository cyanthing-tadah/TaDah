import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WexinUserAccountEntity } from '../account/account.entity'
import { TallAmountTagEntity, TallyDataListEntity, TallyMonthDataEntity } from './tally.entity'
import { TallyService } from './tally.service'
import { TallyController } from './tally.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    TallAmountTagEntity,
    TallyDataListEntity,
    WexinUserAccountEntity,
    TallyMonthDataEntity]),
  ],
  providers: [TallyService],
  exports: [TallyService],
  controllers: [TallyController],
})
export class TallyModule {}
