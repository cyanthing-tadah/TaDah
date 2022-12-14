import * as crypto from 'crypto'
import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MessageService } from '../message/message.service'
import { RedisService } from '../redis/redis.service'
import { MessageXMLData, SubscribeXMLData, XMLBaseData } from './wechat.interface'
import type { ValidationInterfaces } from './wechat.interface'

@Injectable()
export class WechatService {
  private readonly logger = new Logger(WechatService.name)

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 校验微信公众号对接合法性
   * @param validationData
   */
  async checkSignature(validationData: ValidationInterfaces): Promise<string> {
    try {
      // 1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
      const { signature, timestamp, nonce, echostr } = validationData
      const token = this.configService.get<string>('TOKEN')

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
  async handleReceiveMsg(xml: XMLBaseData) {
    const { MsgType } = xml
    switch (MsgType) {
      case 'text':
        return await this.messageService.handleWeChatTextMessage(xml as MessageXMLData)
      case 'event':
        return await this.messageService.handleWeChatSubscribeEvent(xml as SubscribeXMLData)
      default:
        return 'success'
    }
  }

  /**
   * 加载微信凭证
   */
  async loadAccessToken() {
    const APP_ID = this.configService.get<string>('APP_ID')
    const APP_SECRET = this.configService.get<string>('APP_SECRET')
    const res = await this.httpService.get<{ access_token: string; expires_in: number }>(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`)
    res.subscribe({
      error: err => this.logger.error(err, 'load token error'),
      complete: () => this.logger.log('load token success'),
      next: value => this.redisService.setValue('accessToken', value.data.access_token, value.data.expires_in),
    })
  }
}
