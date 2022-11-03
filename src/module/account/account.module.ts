import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HttpExceptionFilter } from '../../core/filters/http-exception.filter'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'
import { WexinUserAccountEntity } from './account.entity'

@Module({
  imports: [TypeOrmModule.forFeature([WexinUserAccountEntity])],
  controllers: [AccountController],
  providers: [
    AccountService,
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
  exports: [AccountService],
})
export class AccountModule {}
