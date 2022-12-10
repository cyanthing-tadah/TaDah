import * as crypto from 'crypto'
import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { AxiosError } from 'axios'
import * as qs from 'qs'
import { catchError, firstValueFrom } from 'rxjs'
import { Repository } from 'typeorm'
import { ExpressageMapDto } from './expressage.dto'
import { ExpressRecordInfoEntity } from './expressage.entity'
import { CompanyItem, ExpressInfo } from './expressage.interface'

@Injectable()
export class ExpressageService {
  private readonly logger = new Logger(ExpressageService.name)
  private privateKey: string
  private customer: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(ExpressRecordInfoEntity) private readonly expressRecordInfoEntity: Repository<ExpressRecordInfoEntity>,
  ) {
    this.privateKey = this.configService.get<string>('EXPRESS_PRIVATE_KEY')
    this.customer = this.configService.get<string>('EXPRESS_CUSTOMER')
  }

  /**
   * 增加一条快递记录
   * @param expressNum
   * @param openid
   */
  async addExpressRecord(expressNum: string, openid: string) {
    const entity = await this.expressRecordInfoEntity.findOne(openid)
    if (!entity) {
      const newEntity = await this.expressRecordInfoEntity.create({ openid, expressNum: [expressNum] })
      await this.expressRecordInfoEntity.save(newEntity)
      return true
    }

    if (entity.expressNum.length >= 4) {
      throw new BadRequestException('最多缓存四个物流单号')
    }

    const list = entity.expressNum
    list.push(expressNum)
    entity.expressNum = list
    const res = await this.expressRecordInfoEntity.update(openid, entity)
    return res.affected !== 0
  }

  /**
   * 删除一个快递单号记录
   * @param expressNum
   * @param openid
   */
  async deleteExpressRecord(expressNum: string, openid: string) {
    const entity = await this.expressRecordInfoEntity.findOne(openid)
    if (!entity) {
      throw new BadRequestException('账户不存在物流单记录')
    }
    entity.expressNum = entity.expressNum.filter(item => item !== expressNum)
    await this.expressRecordInfoEntity.update(openid, entity)
    return true
  }

  /**
   * 查询物流
   * @param num
   */
  async expressRoad(num: string) {
    const companies = await this.recognitionExpress(num)
    if (companies.length) {
      const company = companies[0]
      const param = { com: company.comCode, num, resultv2: 4 }
      const sign = this.md5(JSON.stringify(param) + this.privateKey + this.customer).toUpperCase()
      const { data } = await firstValueFrom(
        this.httpService.post<ExpressInfo>(
          'https://poll.kuaidi100.com/poll/query.do',
          qs.stringify({ param: JSON.stringify(param), customer: this.customer, sign }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        ).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data)
            throw new InternalServerErrorException('无法查询到快递')
          }),
        ))
      if (data.result === false || data.status !== '200') {
        throw new InternalServerErrorException('无法查询到快递')
      }
      return { ...data, comZh: company.name }
    }
    else {
      throw new InternalServerErrorException('没有找到快递公司')
    }
  }

  /**
   * 查询快递地图信息
   * @param param
   */
  async expressMap(param: ExpressageMapDto) {
    const sign = this.md5(JSON.stringify(param) + this.privateKey + this.customer).toUpperCase()
    const { data } = await firstValueFrom(
      this.httpService.post<ExpressInfo>(
        'https://poll.kuaidi100.com/poll/maptrack.do',
        qs.stringify({ param: JSON.stringify(param), customer: this.customer, sign }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      ).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data)
          throw new InternalServerErrorException('无法查询到地图信息')
        }),
      ))
    if (data.result === false || data.status !== '200') {
      throw new InternalServerErrorException('无法查询到地图信息')
    }
    return data
  }

  /**
   * 判断快递公司
   * @param num
   */
  private async recognitionExpress(num: string) {
    const { data } = await firstValueFrom(this.httpService.get<CompanyItem[]>(
      `https://www.kuaidi100.com/autonumber/auto?num=${num}&key=${this.privateKey}`).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw new InternalServerErrorException('无法通过快递单号找到快递公司')
      }),
    ))
    return data
  }

  /**
   * md5加密
   * @param data
   * @private
   */
  private md5(data: string) {
    return crypto.createHash('md5').update(data, 'utf-8').digest('hex')
  }
}
