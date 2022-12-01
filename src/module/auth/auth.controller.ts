import { Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthUser } from '../../core/decorators/user.decorator'
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard'
import { LocalAuthGuard } from '../../core/guards/local-auth.guard'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { AuthService } from './auth.service'

@Controller('auth')
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@AuthUser() user) {
    return this.authService.login(user)
  }

  @Get('ping')
  @UseGuards(JwtAuthGuard)
  async authTest(@AuthUser() user) {
    return user
  }
}
