import * as crypto from 'crypto'
import { Injectable, Logger } from '@nestjs/common'
import { AccountConfig } from '../../config/account.config'
import type { ValidationInterfaces } from './wechat.interface'

@Injectable()
export class WechatService {
  async checkSignature(validationData: ValidationInterfaces): Promise<string> {
    try {
      // 1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
      const { signature, timestamp, nonce, echostr } = validationData
      const { token } = AccountConfig

      // 2.将token、timestamp、nonce三个参数进行字典序排序
      const array = [token, timestamp, nonce]
      array.sort()

      // 3.将三个参数字符串拼接成一个字符串进行sha1加密
      const tmpStr = array.join('')
      const hashCode = crypto.createHash('sha1')
      const resultCode = hashCode.update(tmpStr, 'utf8').digest('hex') // 加密

      // 4.开发者获得加密后的字符串可与signature对比, 如果相等将echostr返回给微信服务器, 完成接入工作
      if (resultCode === signature)
        return echostr

      return 'mismatch'
    }
    catch (error) {
      Logger.error(error, '公众号注册验证 生成字串错误')
      return 'mismatch'
    }
  }
}
