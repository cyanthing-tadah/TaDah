import { BadRequestException, Body, Controller, Get, Logger, Post, Query, UseInterceptors } from '@nestjs/common'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { WeixinAccountDto } from './account.dto'
import { AccountService } from './account.service'

@Controller('account')
@UseInterceptors(TransformResponseInterceptor)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  private readonly logger = new Logger(AccountController.name)

  @Get('/checkRegistration')
  async handleCheckUser(@Query('uid') openid: string) {
    if (openid) {
      return await this.accountService.checkUserInfoRegistration(openid)
    }
    this.logger.error('openid 不存在')
    throw new BadRequestException('openid 不存在')
  }

  @Post('/registerPassword')
  async handleUpdateAccount(@Body() data: WeixinAccountDto) {
    return await this.accountService.updateUserInfo(data)
  }
}
