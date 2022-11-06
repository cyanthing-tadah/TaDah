import { BadRequestException, Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common'
import { HttpExceptionFilter } from '../../core/filters/http-exception.filter'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'

@Controller('account')
@UseInterceptors(TransformResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AccountController {
  @Get('/success')
  testSuccess() {
    return 'success'
  }

  @Get('/failed')
  testFailed() {
    throw new BadRequestException('请求错误')
  }
}
