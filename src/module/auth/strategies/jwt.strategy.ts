import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AccountService } from '../../account/account.service'
import { JwtPayload } from '../auth.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly accountService: AccountService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.PRIVATEKEY,
    })
  }

  /**
   * 用户身份验证
   * @param payload
   */
  async validate(payload: JwtPayload) {
    const { id } = payload
    const entity = await this.accountService.findByOpenid(id)

    if (!entity) {
      throw new UnauthorizedException('该用户验证不通过')
    }
    delete entity.password
    return entity
  }
}
