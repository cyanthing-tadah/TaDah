import { Body, Controller, Post } from '@nestjs/common'
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
}

