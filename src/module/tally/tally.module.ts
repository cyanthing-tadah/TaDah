import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TallAmountTagEntity } from './tally.entity'
import { TallyService } from './tally.service'

@Module({
  imports: [TypeOrmModule.forFeature([TallAmountTagEntity])],
  providers: [TallyService],
  exports: [TallyService],
})
export class TallyModule {}
