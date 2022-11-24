import { BadRequestException, Controller, Get, Logger, UseFilters, UseInterceptors } from '@nestjs/common'
import { HttpExceptionFilter } from '../../core/filters/http-exception.filter'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'

@Controller('account')
@UseInterceptors(TransformResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AccountController {
  private readonly logger = new Logger(AccountController.name)

  @Get('/success')
  testSuccess() {
    console.log(process.env)
    this.logger.log('success')
    return 'success'
  }

  @Get('/failed')
  testFailed() {
    throw new BadRequestException('请求错误')
  }
}
