import * as crypto from 'crypto'
import { create } from 'xmlbuilder2'
import { Injectable, Logger } from '@nestjs/common'
import { AccountConfig } from '../../config/account.config'
import { AccountService } from '../account/account.service'
import type { ValidationInterfaces } from './wechat.interface'

@Injectable()
export class WechatService {
  constructor(private readonly accountService: AccountService) {}

  /**
   * 返回微信公众号配置
   */
  loadWeixinConfig() {
    return AccountConfig
  }

  /**
   * 校验微信公众号对接合法性
   * @param validationData
   */
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
      if (resultCode === signature) {
        return echostr
      }

      return 'mismatch'
    }
    catch (error) {
      Logger.error(error, '公众号注册验证 生成字串错误')
      return 'mismatch'
    }
  }

  /**
   * 处理接收到的微信消息
   * @param xml
   */
  async handleReceiveMsg(xml: any) {
    await this.accountService.saveUserInfo({ openid: xml.FromUserName, headimgurl: '', nickname: xml.FromUserName })

    return create({
      xml: {
        ToUserName: xml.FromUserName,
        FromUserName: xml.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: '你好',
      },
    }).end({ prettyPrint: true })
  }
}
