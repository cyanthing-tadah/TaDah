import { Injectable } from '@nestjs/common'
import { handleReturnTextMessage } from 'src/helper'
import { AccountService } from '../account/account.service'
import { TallyService } from '../tally/tally.service'
import { MessageXMLData, SubscribeXMLData } from '../wechat/wechat.interface'
import { subscribeMessage } from '../../helper/backMessage.template'

enum ContentType {
  tally = 'tally',
  monthTarget = 'monthTarget',
  findMonthTarget = 'findMonthTarget',
  nothing = 'nothing',
  translate = 'translate',
}

@Injectable()
export class MessageService {
  constructor(private readonly accountService: AccountService, private readonly tallyService: TallyService) {}

  /**
   * 处理微信文本消息
   * @param xml
   */
  async handleWeChatTextMessage(xml: MessageXMLData) {
    const { Content } = xml
    const type = this.computeTypeOfContent(Content)

    switch (type) {
      case ContentType.tally:
        return await this.tallyService.handleAddTally(xml)
      case ContentType.monthTarget:
        return await this.tallyService.handleMonthTarget(xml)
      case ContentType.findMonthTarget:
        return await this.tallyService.handleFindMonthData(xml)
      case ContentType.nothing:
      default:
        return handleReturnTextMessage(xml, 'TaDah不明白您的指令呢')
    }
  }

  /**
   * 处理微信订阅公众号事件
   * @param xml
   */
  async handleWeChatSubscribeEvent(xml: SubscribeXMLData) {
    const { Event } = xml

    switch (Event) {
      case 'subscribe':
        await this.accountService.saveUserInfo({ openid: xml.FromUserName, headimgurl: '', nickname: '', email: '', password: null })
        return handleReturnTextMessage(xml, subscribeMessage)
      case 'unsubscribe':
      default:
        return 'success'
    }
  }

  /**
   * 处理出信息是什么类型的指令
   * @param content
   */
  private computeTypeOfContent(content: string): ContentType {
    if (content.startsWith('记账')) {
      return ContentType.tally
    }
    if (content.startsWith('账单')) {
      return ContentType.monthTarget
    }
    if (content.startsWith('本月账单剩余')) {
      return ContentType.findMonthTarget
    }
    if (content.startsWith('翻译')) {
      return ContentType.translate
    }
    return ContentType.nothing
  }
}
