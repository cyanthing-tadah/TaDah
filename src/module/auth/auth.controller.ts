import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LoginDto } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 登录
   * @param data
   */
  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data)
  }

  @Get('test')
  @UseGuards(AuthGuard())
  async authTest(@Req() req) {
    console.log(req.user)
    return { message: 'ok' }
  }
}

