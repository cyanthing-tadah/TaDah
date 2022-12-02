import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthUser } from '../../core/decorators/user.decorator'
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { UpdateInfoDto, UpdatePasswordDto, WeixinAccountDto } from './account.dto'
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

  /**
   * 更新用户信息
   * @param data
   * @param user
   */
  @Put('/updateUserInfo')
  @UseGuards(JwtAuthGuard)
  async handleUpdateUserInfo(@Body() data: UpdateInfoDto, @AuthUser() user: { openid: string }) {
    const result = await this.accountService.updateUserInfo({ openid: user.openid, ...data })
    if (result.affected !== 0) {
      return true
    }
    throw new InternalServerErrorException('更新错误')
  }

  /**
   * 更新用户密码
   * @param data
   * @param user
   */
  @Put('/updatePassword')
  @UseGuards(JwtAuthGuard)
  async handleUpdatePassword(@Body() data: UpdatePasswordDto, @AuthUser() user: { openid: string }) {
    const result = await this.accountService.updatePassword({ openid: user.openid, ...data })
    if (result.affected !== 0) {
      return true
    }
    throw new InternalServerErrorException('更新错误')
  }
}
