import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { handleReturnTextMessage } from '../../helper'
import { WexinUserAccountEntity } from '../account/account.entity'
import { MessageXMLData } from '../wechat/wechat.interface'
import { TallAmountTagEntity, TallyDataListEntity, TallyMonthDataEntity } from './tally.entity'

@Injectable()
export class TallyService {
  constructor(
    @InjectRepository(WexinUserAccountEntity) private readonly wexinUserAccountEntity: Repository<WexinUserAccountEntity>,
    @InjectRepository(TallyDataListEntity) private readonly tallyDataListEntity: Repository<TallyDataListEntity>,
    @InjectRepository(TallAmountTagEntity) private readonly tallAmountTagEntity: Repository<TallAmountTagEntity>,
    @InjectRepository(TallyMonthDataEntity) private readonly tallyMonthDataEntity: Repository<TallyMonthDataEntity>,
  ) {}

  /**
   * 指令记账
   * @param xml
   */
  async handleAddTally(xml: MessageXMLData) {
    const { success, info, record } = this.computeTallyInfo(xml.Content)
    if (success) {
      const result = await this.saveOneTallyInfo(record, xml)
      console.log(result)
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
      const [tagName, description] = infoList
      let [,,count] = infoList
      count = count.endsWith('元') ? count.substring(0, count.length - 1) : count

      if (/^\d+(\.\d{1,2})?$/.test(count) && count.length <= 12) {
        return { success: true, info: '成功解析', record: { tagName, description, count } }
      }

      errorInfo = `记账金额有误：\n${count}\n金额最多2位小数且不能超过亿元`
    }
    errorInfo = `此段记账格式有误：\n${result}\n无法解析出有效信息（类目、消费描述、金额），保证彼此之间用空格分割`

    return { success: false, info: errorInfo }
  }

  /**
   * 存储一笔记账信息
   * @param record
   * @param xml
   */
  async saveOneTallyInfo(record: { tagName: string; count: string; description: string }, xml: MessageXMLData) {
    console.log(record, xml)
    // const { count, description, tagName } = record
    // let amountTag = await this.tallAmountTagEntity.findOne({ tagName, weixinUser: { openid: xml.FromUserName } })
    //
    // if (!amountTag) {
    //   amountTag = this.tallAmountTagEntity.create({ tagName, emojiName: 'question', weixinUser: { openid: xml.FromUserName } })
    //   await this.tallAmountTagEntity.save(amountTag)
    // }
    //
    // const recordEntity = this.tallyDataListEntity.create({
    //   count: parseFloat(count) * 100,
    //   description,
    //   weixinUser: { openid: xml.FromUserName },
    //   amountTag,
    // })
    //
    // await this.tallyDataListEntity.save(recordEntity)
  }
}
