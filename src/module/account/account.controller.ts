import { BadRequestException, Controller, Get, Logger, UseFilters, UseInterceptors } from '@nestjs/common'
import { HttpExceptionFilter } from '../../core/filters/http-exception.filter'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { handleRedisConfig } from '../../helper'

@Controller('account')
@UseInterceptors(TransformResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AccountController {
  private readonly logger = new Logger(AccountController.name)

  @Get('/success')
  testSuccess() {
    this.logger.log(handleRedisConfig())
    this.logger.log('success')
    return 'success'
  }

  @Get('/failed')
  testFailed() {
    throw new BadRequestException('请求错误')
  }
}
