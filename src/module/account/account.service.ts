import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { WexinUserAccountEntity } from './account.entity'
import { WeixinAccountDto } from './account.dto'

@Injectable()
export class AccountService {
  constructor(@InjectRepository(WexinUserAccountEntity) private readonly wexinUserAccountEntity: Repository<WexinUserAccountEntity>) {}

  /**
   * 存储用户信息
   * @param userInfo
   */
  async saveUserInfo(userInfo: WeixinAccountDto) {
    const entity = await this.wexinUserAccountEntity.create(userInfo)
    return this.wexinUserAccountEntity.save(entity)
  }

  async updateUserInfo(userInfo: WeixinAccountDto) {
    const entity = await this.wexinUserAccountEntity.findOne({ openid: userInfo.openid })
    if (!entity) {
      throw new NotFoundException('未找到该uid用户')
    }
    return await this.wexinUserAccountEntity.update(userInfo.openid, { ...entity, ...userInfo })
  }

  async checkUserInfoRegistration(openid: string) {
    const userInfo = await this.wexinUserAccountEntity.findOne({ openid })
    return userInfo.password != null
  }
}
