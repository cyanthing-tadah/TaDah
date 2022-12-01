import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'uid',
      passwordField: 'password',
    })
  }

  async validate(uid: string, password: string) {
    const result = await this.authService.validateUser({ uid, password })
    if (!result.ok) {
      throw new UnauthorizedException(result.message)
    }
    return { id: result.data.openid, name: result.data.nickname }
  }
}
