import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AccountService } from '../account/account.service'
import { LoginDto } from './auth.dto'
import { JwtPayload } from './auth.interface'

@Injectable()
export class AuthService {
  constructor(private readonly accountService: AccountService, private readonly jwtService: JwtService) {}

  /**
   * 登录逻辑
   * @param data
   */
  async login(data: LoginDto) {
    const { uid: openid, password } = data
    const entity = await this.accountService.findByOpenid(openid)

    if (!entity) {
      throw new UnauthorizedException('用户UID不存在')
    }

    if (!(await entity.comparePassword(password))) {
      throw new UnauthorizedException('用户密码不匹配')
    }

    const { openid: id, nickname } = entity
    const payload = { id, name: nickname }
    const token = this.signToken(payload)
    return { ...payload, token }
  }

  /**
   * 签发token
   * @param data
   * @private
   */
  private signToken(data: JwtPayload) {
    return this.jwtService.sign(data)
  }
}

