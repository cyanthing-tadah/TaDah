import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AccountService } from '../account/account.service'
import { LoginDto } from './auth.dto'
import { JwtPayload } from './auth.interface'

@Injectable()
export class AuthService {
  constructor(private readonly accountService: AccountService, private readonly jwtService: JwtService) {}

  /**
   * 登录逻辑 签发token
   * @param data
   */
  async login(data: JwtPayload) {
    return this.jwtService.sign(data)
  }

  /**
   * 校验id与密码是否匹配登录
   * @param data
   */
  async validateUser(data: LoginDto) {
    const { uid: openid, password } = data
    const entity = await this.accountService.findByOpenid(openid)

    if (!entity) {
      return { ok: false, message: '用户UID不存在' }
    }
    if (!(await entity.comparePassword(password))) {
      return { ok: false, message: '用户密码不匹配' }
    }

    delete entity.password
    return { ok: true, data: entity }
  }
}

