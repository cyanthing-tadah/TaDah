import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AccountService } from '../account/account.service'
import { LoginDto } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(private readonly accountService: AccountService) {}

  async login(data: LoginDto) {
    const { uid: openid, password } = data
    const entity = await this.accountService.findByOpenid(openid)

    if (!entity) {
      throw new UnauthorizedException('用户UID不存在')
    }

    if (!(await entity.comparePassword(password))) {
      throw new UnauthorizedException('用户密码不匹配')
    }

    return entity
  }
}

