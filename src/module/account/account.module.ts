import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { HttpExceptionFilter } from '../../core/filters/http-exception.filter'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AccountModule {}
