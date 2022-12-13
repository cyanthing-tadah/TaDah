import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as dayjs from 'dayjs'
import { Repository } from 'typeorm'
import { handleReturnTextMessage } from '../../helper'
import { WexinUserAccountEntity } from '../account/account.entity'
import { MessageXMLData } from '../wechat/wechat.interface'
import { TallAmountTagEntity, TallyDataListEntity, TallyMonthDataEntity } from './tally.entity'

enum AmountType {
  paid = 0,
  income = 1,
}

const exampleText = '\n举个🌰：记账 咖啡 斯达巴克的焦糖玛奇朵 消费39.9元'
const exampleMonthDataText = '\n举个🌰：账单 本月收入100000元 本月消费目标50000元'
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
      const { result, warningInfo, resultText } = await this.saveOneTallyInfo(record, xml)
      const dateStr = dayjs(result.createTime).format('YYYY年MM月 HH:mm')
      const backMessage = `🎉 Ta Dah! 记账成功：\n${dateStr}时您${result.amountType === AmountType.paid ? '消费' : '收入'}${(result.count / 100).toFixed(2)}元${warningInfo}\n${resultText}`
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
      warningInfo += `\n🕵🏻本月您还没有设定收入、目标支出数值，您可以进入应用设置或发送指令${exampleMonthDataText}`
    }

    const recordEntity = this.tallyDataListEntity.create({ count: parseFloat(count) * 100, description, amountTag, monthData, amountType })
    const result = await this.tallyDataListEntity.save(recordEntity)
    const { residueTarget, currentSalary } = await this.computeCurrentCount(monthData)
    return { result, warningInfo, resultText: `目前您的本月工资余额为${(currentSalary / 100).toFixed(2)}元\n目前您的目标开支余额为${(residueTarget / 100).toFixed(2)}元` }
  }

  /**
   * 更新or增设当月收入与目标
   * @param xml
   */
  async handleMonthTarget(xml: MessageXMLData) {
    const { success, info, record } = this.computeMonthTargetData(xml.Content)
    if (success) {
      const result = await this.saveMonthData(record, xml)
      return handleReturnTextMessage(xml, result)
    }
    return handleReturnTextMessage(xml, info)
  }

  /**
   * 处理出月度计划指令的关键信息
   * @private
   * @param content
   */
  private computeMonthTargetData(content: string) {
    const result = content.slice(2).trim()
    const infoList = result.split(' ')
    let errorInfo = ''
    if (infoList.length === 2) {
      let incomeCount: string
      let targetCount: string
      infoList.forEach((item) => {
        if (item.includes('收入')) {
          incomeCount = item
        }
        if (item.includes('目标')) {
          targetCount = item
        }
      })

      if (incomeCount && targetCount) {
        incomeCount = incomeCount.match(/\d+(\.\d{1,2})?/)[0]
        targetCount = targetCount.match(/\d+(\.\d{1,2})?/)[0]
        if (incomeCount && targetCount && incomeCount.length <= 12 && targetCount.length <= 12) {
          const incomeCountRes = parseFloat(incomeCount)
          const targetCountRes = parseFloat(targetCount)
          if (incomeCountRes >= targetCountRes) {
            return { success: true, record: { incomeCount: incomeCountRes, targetCount: targetCountRes } }
          }

          errorInfo = `收入与支出目标关系不对\n收入${incomeCountRes}元不能低于消费目标${targetCountRes}元`
          return { success: false, info: errorInfo }
        }
        errorInfo = `收入与支出目标有误，无法识别出具体数额，或数额太大辣！请自行检查${exampleMonthDataText}`
        return { success: false, info: errorInfo }
      }
      errorInfo = `此段指令格式有误：\n${result}\n无法解析本月收入、本月消费目标，保证收入与消费目标文字编写明确${exampleMonthDataText}`
      return { success: false, info: errorInfo }
    }

    errorInfo = `此段指令格式有误：\n${result}\n无法解析出有效信息（本月收入、本月目标），保证彼此之间用空格分割${exampleMonthDataText}`
    return { success: false, info: errorInfo }
  }

  /**
   * 存储or更新月度数据
   * @param record
   * @param xml
   */
  async saveMonthData(record: { incomeCount: number; targetCount: number }, xml: MessageXMLData) {
    const { incomeCount: income, targetCount: target } = record
    const year = dayjs(xml.CreateTime * 1000).year()
    const month = dayjs(xml.CreateTime * 1000).month() + 1
    let monthData = await this.tallyMonthDataEntity.findOne({ year, month, weixinUser: { openid: xml.FromUserName } })
    let resultText = '本月收入与消费目标成功\n🧾 基于您的本月已累计账单：\n'
    if (!monthData) {
      monthData = await this.tallyMonthDataEntity.create({ year, month, income, target, weixinUser: { openid: xml.FromUserName } })
      resultText = `🎉 创建${resultText}`
    }
    else {
      await this.tallyMonthDataEntity.update(monthData.id, { year, month, income, target, weixinUser: { openid: xml.FromUserName } })
      monthData.income = income
      monthData.target = target
      resultText = `✍️ 更新${resultText}`
    }
    await this.tallyMonthDataEntity.save(monthData)
    const { currentSalary, residueTarget } = await this.computeCurrentCount(monthData)
    return `${resultText}目前您的本月工资余额为${(currentSalary / 100).toFixed(2)}元\n目前您的目标开支余额为${(residueTarget / 100).toFixed(2)}元`
  }

  /**
   * 计算工资剩余和目标支出剩余
   * @param monthData
   */
  async computeCurrentCount(monthData: TallyMonthDataEntity) {
    const { id, target = 0, income = 0 } = monthData
    const tallyDataListQueryBuilder = this.tallyDataListEntity.createQueryBuilder('tallyData')
    tallyDataListQueryBuilder
      .where('tallyData.delete=false')
      .where('monthDataId=:id', { id })
      .orderBy('tallyData.createTime', 'DESC')
      .select(['tallyData.count', 'tallyData.amountType'])
    const list = await tallyDataListQueryBuilder.getMany()

    let vector = 0
    list.forEach((item) => {
      if (item.amountType === 0) {
        vector -= item.count
      }
      else {
        vector += item.count
      }
    })
    return { currentSalary: income * 100 + vector, residueTarget: target * 100 + vector }
  }

  /**
   * 查询消费状况
   * @param xml
   */
  async handleFindMonthData(xml: MessageXMLData) {
    const year = dayjs(xml.CreateTime * 1000).year()
    const month = dayjs(xml.CreateTime * 1000).month() + 1
    const monthData = await this.tallyMonthDataEntity.findOne({ year, month, weixinUser: { openid: xml.FromUserName } })
    if (!monthData) {
      return handleReturnTextMessage(xml, `👻 哈？经过一番查找，您本月还未记账呢${exampleText}`)
    }
    const { currentSalary, residueTarget } = await this.computeCurrentCount(monthData)
    if (monthData.income && monthData.target) {
      return handleReturnTextMessage(xml, `🧐 嗯！经过一番查找，您目前的消费：\n月工资余额${(currentSalary / 100).toFixed(2)}元\n月目标开支余额${(residueTarget / 100).toFixed(2)}元`)
    }
    return handleReturnTextMessage(xml, `💁🏻 哦！您本月还没有设置收入与目标开支呢\n您目前的消费：\n${(currentSalary / 100).toFixed(2)}元`)
  }

  /**
   * 查询目标月的消费情况
   * @param openid
   * TODO 不分页可能存在一些问题
   */
  async handleFindTargetMonthData(openid: string) {
    const monthDataList = await this.tallyMonthDataEntity.find({ where: { weixinUser: { openid } }, order: { year: 'ASC', month: 'ASC' } })
    const result: (TallyMonthDataEntity & { currentSalary: number; residueTarget: number })[] = []
    for (let i = 0; i < monthDataList.length; i++) {
      const { currentSalary, residueTarget } = await this.computeCurrentCount(monthDataList[i])
      result.push({ ...monthDataList[i], currentSalary, residueTarget, income: monthDataList[i].income * 100, target: monthDataList[i].target * 100 })
    }
    return result
  }

  /**
   * 查询账单
   * @param id
   * TODO 不分页可能存在性能问题
   */
  async handleLoadTargetMonthList(id: number) {
    const tallyDataListQueryBuilder = this.tallyDataListEntity.createQueryBuilder('tallyData')
    tallyDataListQueryBuilder
      .where('tallyData.delete=false')
      .where('monthDataId=:id', { id })
      .leftJoinAndSelect('tallyData.amountTag', 'amountTag')
      .orderBy('tallyData.createTime', 'DESC')
    return await tallyDataListQueryBuilder.getMany()
  }

  /**
   * 设置或更新月度数据
   * @param income
   * @param target
   * @param openid
   */
  async handleSetMonthData(income: number, target: number, openid: string) {
    const year = dayjs().year()
    const month = dayjs().month() + 1
    const monthData = await this.tallyMonthDataEntity.findOne({ year, month, weixinUser: { openid } })
    if (!monthData) {
      const newMonthData = await this.tallyMonthDataEntity.create({ year, month, income, target, weixinUser: { openid } })
      return await this.tallyMonthDataEntity.save(newMonthData)
    }

    monthData.income = income
    monthData.target = target
    return await this.tallyMonthDataEntity.save(monthData)
  }

  /**
   * 加载用户 Tag 列表
   * @param openid
   */
  async loadTagList(openid: string) {
    return this.tallAmountTagEntity.find({ weixinUser: { openid } })
  }

  /**
   * 设置标签
   * @param tagId
   * @param tagName
   * @param emojiName
   * @param openid
   */
  async changeOrSetTag(tagId: number, tagName: string, emojiName: string, openid: string) {
    const entity = await this.tallAmountTagEntity.findOne({ tagId })

    if (!entity) {
      const newEntity = await this.tallAmountTagEntity.create({ tagName, emojiName, weixinUser: { openid } })
      await this.tallAmountTagEntity.save(newEntity)
      return true
    }

    entity.tagName = tagName
    entity.emojiName = emojiName
    const res = await this.tallAmountTagEntity.update(tagId, entity)
    return res.affected !== 0
  }

  /**
   * 创建记账
   * @param data
   */
  async handleAddRecord(data: { openid: string; year: number; month: number; count: number; description: string; tagId: number; amountType: 0 | 1 }) {
    const { year, month, openid, tagId, count, description, amountType } = data
    const monthDataEntity = await this.tallyMonthDataEntity.findOne({ year, month, weixinUser: { openid } })
    const tagEntity = await this.tallAmountTagEntity.findOne(tagId)
    if (!monthDataEntity) {
      throw new BadRequestException('本月资金信息缺失，请在上一页补充')
    }
    if (!tagEntity) {
      throw new BadRequestException('请先创建标签s')
    }
    const entity = await this.tallyDataListEntity.create({
      count,
      amountType,
      monthData: monthDataEntity,
      amountTag: tagEntity,
      description,
    })
    return await this.tallyDataListEntity.save(entity)
  }
}
