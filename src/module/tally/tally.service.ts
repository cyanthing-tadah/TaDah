import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as dayjs from 'dayjs'
import { handleReturnTextMessage } from '../../helper'
import { WexinUserAccountEntity } from '../account/account.entity'
import { MessageXMLData } from '../wechat/wechat.interface'
import { TallAmountTagEntity, TallyDataListEntity, TallyMonthDataEntity } from './tally.entity'

enum AmountType {
  paid = 0,
  income = 1,
}

const exampleText = '\n举个🌰：记账 咖啡 斯达巴克的焦糖玛奇朵 消费39.9元'
const paidTypes = ['花费', '消费', '减少', '支出']
const incomeTypes = ['收入', '收到', '增加']

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
      const { result, warningInfo } = await this.saveOneTallyInfo(record, xml)
      const dateStr = dayjs(result.createTime).format('YYYY年MM月 HH:mm')
      const backMessage = `🎉 Ta Dah! 记账成功：\n${dateStr}时您${result.amountType === AmountType.paid ? '消费' : '收入'}${(result.count / 100).toFixed(2)}元${warningInfo}`
      return handleReturnTextMessage(xml, backMessage)
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
      let amountType = AmountType.paid
      count = count.endsWith('元') ? count.substring(0, count.length - 1) : count
      const startTwoWord = count.substring(0, 2)

      if ([...paidTypes, ...incomeTypes].includes(startTwoWord)) {
        if (paidTypes.includes(startTwoWord)) {
          amountType = AmountType.paid
        }
        if (incomeTypes.includes(startTwoWord)) {
          amountType = AmountType.income
        }
        count = count.substring(2, count.length)
      }

      if (/^\d+(\.\d{1,2})?$/.test(count) && count.length <= 12) {
        return { success: true, info: '成功解析', record: { tagName, description, count, amountType } }
      }

      errorInfo = `记账金额或类型有误：\n${count}\n金额最多2位小数且不能超过亿元\n金额前的记账类型只能两字且限定${[...paidTypes, ...incomeTypes].join('、')}或不填写${exampleText}`
      return { success: false, info: errorInfo }
    }
    errorInfo = `此段记账格式有误：\n${result}\n无法解析出有效信息（类目、消费描述、金额），保证彼此之间用空格分割${exampleText}`
    return { success: false, info: errorInfo }
  }

  /**
   * 存储一笔记账信息
   * @param record
   * @param xml
   */
  async saveOneTallyInfo(record: { tagName: string; count: string; description: string; amountType: AmountType }, xml: MessageXMLData) {
    const { count, description, tagName, amountType } = record
    const year = dayjs(xml.CreateTime * 1000).year()
    const month = dayjs(xml.CreateTime * 1000).month() + 1
    let warningInfo = ''
    let amountTag = await this.tallAmountTagEntity.findOne({ tagName, weixinUser: { openid: xml.FromUserName } })
    let monthData = await this.tallyMonthDataEntity.findOne({ year, month, weixinUser: { openid: xml.FromUserName } })

    if (!amountTag) {
      amountTag = this.tallAmountTagEntity.create({ tagName, emojiName: 'question', weixinUser: { openid: xml.FromUserName } })
      await this.tallAmountTagEntity.save(amountTag)
      warningInfo += `\n🏷️${tagName} 标签您未曾创建，系统自动为您创建此标签，您可以进入系统更改该标签emoji`
    }

    if (!monthData) {
      monthData = this.tallyMonthDataEntity.create({ year, month, weixinUser: { openid: xml.FromUserName } })
      await this.tallyMonthDataEntity.save(monthData)
    }

    if (!monthData.income || !monthData.target) {
      warningInfo += '\n👨🏻‍💻本月您还没有设定收入、目标支出数值，您可以发送指令：账单 本月收入xx元 本月目标xx元'
    }

    const recordEntity = this.tallyDataListEntity.create({ count: parseFloat(count) * 100, description, amountTag, monthData, amountType })
    const result = await this.tallyDataListEntity.save(recordEntity)
    return { result, warningInfo }
  }
}
