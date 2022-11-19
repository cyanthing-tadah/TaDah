import { Injectable } from '@nestjs/common'
import { handleReturnTextMessage } from '../../helper'
import { MessageXMLData } from '../wechat/wechat.interface'

@Injectable()
export class TallyService {
  /**
   * 指令记账
   * @param xml
   */
  handleAddTally(xml: MessageXMLData) {
    const { success, info } = this.computeTallyInfo(xml.Content)
    if (success) {
      return ''
    }
    return handleReturnTextMessage(xml, info)
  }

  /**
   * 处理记账信息
   * @param content
   * @private
   */
  private computeTallyInfo(content: string) {
    const result = content.slice(2).trim()
    const infoList = result.split(' ')
    let errorInfo: string

    if (infoList.length === 3) {
      const [amountType, amountDesc] = infoList
      let [,,amountCount] = infoList
      amountCount = amountCount.endsWith('元') ? amountCount.substring(0, amountCount.length - 1) : amountCount

      if (/^\d+(\.\d{1,2})?$/.test(amountCount) && amountCount.length <= 12) {
        return { success: true, info: '成功解析', amountType, amountDesc, amountCount }
      }

      errorInfo = `记账金额有误：\n${amountCount}\n金额最多2位小数且不能超过亿元`
    }
    errorInfo = `此段记账格式有误：\n${result}\n无法解析出有效信息（类目、消费描述、金额），保证彼此之间用空格分割`

    return { success: false, info: errorInfo }
  }
}
