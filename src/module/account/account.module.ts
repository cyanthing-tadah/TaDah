import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'
import { WexinUserAccountEntity } from './account.entity'

@Module({
  imports: [TypeOrmModule.forFeature([WexinUserAccountEntity])],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
