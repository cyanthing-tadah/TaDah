import { BadRequestException, Body, Controller, Get, Logger, Post, Put, Query, UseInterceptors } from '@nestjs/common'
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

  /**
   * 首次使用 H5 应用时需要注册密码、邮箱、用户名等信息
   * @param uid
   * @param data
   */
  @Post('/registerPassword')
  async handleRegisterPasswordInfo(@Query('uid') uid: string, @Body() data: Omit<WeixinAccountDto, 'openid'>) {
    const res = await this.accountService.handleRegisterPasswordInfo({ ...data, openid: uid })
    return res.affected !== 0
  }

  @Put('/updatePassword')
  async handleUpdatePassword() {
    return ''
  }
}
