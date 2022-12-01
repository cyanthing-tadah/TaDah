import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
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

  /**
   * 首次使用 H5 应用时注册密码、邮箱、用户名等信息
   * @param userInfo
   */
  async handleRegisterPasswordInfo(userInfo: WeixinAccountDto) {
    const entity = await this.wexinUserAccountEntity.findOne({ openid: userInfo.openid })

    if (!entity) {
      throw new NotFoundException('未找到该UID用户')
    }
    if (entity.password) {
      throw new UnauthorizedException('该用户已完成注册')
    }

    const newEntity = await this.wexinUserAccountEntity.create({ ...entity, ...userInfo })
    return this.wexinUserAccountEntity.update(userInfo.openid, newEntity)
  }

  /**
   * 检查用户是否注册过应用
   * @param openid
   */
  async checkUserInfoRegistration(openid: string) {
    const entity = await this.wexinUserAccountEntity.findOne({ openid })
    if (!entity) {
      throw new NotFoundException('没有该UID对应的用户')
    }
    return Boolean(entity.password)
  }

  /**
   * openid 查询用户信息
   * @param openid
   */
  async findByOpenid(openid: string) {
    return this.wexinUserAccountEntity.findOne({ openid })
  }
}
