import { Injectable } from '@nestjs/common'
import { create } from 'xmlbuilder2'
import { AccountService } from '../account/account.service'
import { MessageXMLData, SubscribeXMLData, XMLBaseData } from '../wechat/wechat.interface'
import { subscribeMessage } from './backMessage.template'

@Injectable()
export class MessageService {
  constructor(private readonly accountService: AccountService) {}

  /**
   * 处理微信文本消息
   * @param xml
   */
  handleWeChatTextMessage(xml: MessageXMLData) {
    const { Content } = xml

    return this.handleReturnTextMessage(xml, Content)
  }

  /**
   * 处理微信订阅公众号事件
   * @param xml
   */
  async handleWeChatSubscribeEvent(xml: SubscribeXMLData) {
    const { Event } = xml

    switch (Event) {
      case 'subscribe':
        await this.accountService.saveUserInfo({ openid: xml.FromUserName, headimgurl: '', nickname: xml.FromUserName })
        return this.handleReturnTextMessage(xml, subscribeMessage)
      case 'unsubscribe':
      default:
        return 'success'
    }
  }

  /**
   * 返回文本消息公用方法
   * @param xml
   * @param content
   */
  handleReturnTextMessage(xml: XMLBaseData, content: string) {
    return create({
      xml: {
        ToUserName: xml.FromUserName,
        FromUserName: xml.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: content,
      },
    }).end({ prettyPrint: true })
  }
}
