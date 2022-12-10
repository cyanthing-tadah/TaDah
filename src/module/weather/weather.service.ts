import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { catchError, firstValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { AxiosError } from 'axios'
import { Repository } from 'typeorm'
import { WeatherCityInfoEntity } from './weather.entity'
import {
  AirQuality,
  CityListItem,
  CurrentWeatherItem,
  LiveQuality,
  Next5DayWeather, NextAlarmItem,
  OneDayEveryHourWeather,
} from './weather.interface'

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name)
  private privateKey: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(WeatherCityInfoEntity) private readonly weatherCityInfoEntity: Repository<WeatherCityInfoEntity>,
  ) {
    this.privateKey = this.configService.get<string>('WEATHER_PRIVATE_KEY')
  }

  /**
   * 增加一条城市记录
   * @param cityCode
   * @param cityName
   * @param openid
   */
  async addWeatherCityInfo(cityCode: string, cityName: string, openid: string) {
    const entity = await this.weatherCityInfoEntity.findOne(openid)
    if (!entity) {
      const newEntity = await this.weatherCityInfoEntity.create({ openid, cities: [{ cityCode, cityName }] })
      await this.weatherCityInfoEntity.save(newEntity)
      return true
    }

    if (entity.cities.length >= 4) {
      throw new BadRequestException('最多缓存四个城市天气')
    }

    const list = entity.cities
    list.push({ cityCode, cityName })
    entity.cities = list
    const res = await this.weatherCityInfoEntity.update(openid, entity)
    return res.affected !== 0
  }

  /**
   * 删除一个城市信息
   * @param cityCode
   * @param cityName
   * @param openid
   */
  async deleteWeatherCityInfo(cityCode: string, cityName: string, openid: string) {
    const entity = await this.weatherCityInfoEntity.findOne(openid)
    if (!entity) {
      throw new BadRequestException('账户不存在城市信息')
    }
    entity.cities = entity.cities.filter(item => item.cityCode !== cityCode)
    await this.weatherCityInfoEntity.update(openid, entity)
    return true
  }

  /**
   * 查询城市
   * @param keyword
   */
  async findCity(keyword: string) {
    const { data } = await firstValueFrom(this.httpService.get<{ results: CityListItem[] }>(
      `https://api.seniverse.com/v3/location/search.json?key=${this.privateKey}&q=${keyword}`).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw new InternalServerErrorException('搜索城市错误')
      }),
    ))
    return data
  }

  /**
   * 当前城市当日天气
   * @param cityCode
   */
  async currentCityWeather(cityCode: string) {
    const { data } = await firstValueFrom(this.httpService.get<{ results: CurrentWeatherItem[] }>(
      `https://api.seniverse.com/v3/weather/now.json?key=${this.privateKey}&location=${cityCode}`).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw new InternalServerErrorException('获取当日天气错误')
      }),
    ))
    return data
  }

  /**
   * 当前城市未来灾害预警
   * @param cityCode
   */
  async nextAlarm(cityCode: string) {
    const { data } = await firstValueFrom(this.httpService.get<{ results: NextAlarmItem[] }>(
      `https://api.seniverse.com/v3/weather/alarm.json?detail=more&key=${this.privateKey}&location=${cityCode}`).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw new InternalServerErrorException('获取灾害预警错误')
      }),
    ))
    return data
  }

  /**
   * 当前城市未来5日天气
   * @param cityCode
   */
  async next5dayWeather(cityCode: string) {
    const { data } = await firstValueFrom(this.httpService.get<{ results: Next5DayWeather[] }>(
      `https://api.seniverse.com/v3/weather/daily.json?key=${this.privateKey}&location=${cityCode}&start=1&days=5`).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw new InternalServerErrorException('获取未来五日天气错误')
      }),
    ))
    return data
  }

  /**
   * 未来24小时天气情况
   * @param cityCode
   */
  async next24HoursWeather(cityCode: string) {
    const { data } = await firstValueFrom(this.httpService.get<{ results: OneDayEveryHourWeather[] }>(
      `https://api.seniverse.com/v3/weather/hourly.json?key=${this.privateKey}&location=${cityCode}`).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw new InternalServerErrorException('查询24小时天气错误')
      }),
    ))
    return data
  }

  /**
   * 空气质量
   * @param cityCode
   */
  async airQuality(cityCode: string) {
    const { data } = await firstValueFrom(this.httpService.get<{ results: AirQuality[] }>(
      `https://api.seniverse.com/v3/air/now.json?key=${this.privateKey}&location=${cityCode}`).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw new InternalServerErrorException('查询空气质量错误')
      }),
    ))
    return data
  }

  /**
   * 生活指数
   * @param cityCode
   */
  async liveQuality(cityCode: string) {
    const { data } = await firstValueFrom(this.httpService.get<{ results: LiveQuality[] }>(
      `https://api.seniverse.com/v3/life/suggestion.json?key=${this.privateKey}&location=${cityCode}`).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw new InternalServerErrorException('查询生活指数错误')
      }),
    ))
    return data
  }
}
