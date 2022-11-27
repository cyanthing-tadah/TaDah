import { Controller, Get, Logger, Post, Query, UseFilters, UseInterceptors } from '@nestjs/common'
import { HttpExceptionFilter } from '../../core/filters/http-exception.filter'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { AccountService } from './account.service'

@Controller('account')
@UseInterceptors(TransformResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  private readonly logger = new Logger(AccountController.name)

  @Get('/checkRegistration')
  async handleCheckUser(@Query('uid') openid: string) {
    return await this.accountService.checkUserInfoRegistration(openid)
  }

  @Post('/update')
  handleUpdateAccount() {}
}
