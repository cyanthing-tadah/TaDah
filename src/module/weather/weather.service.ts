import { HttpService } from '@nestjs/axios'
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { catchError, firstValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { AxiosError } from 'axios'
import {
  AirQuality,
  CityListItem,
  CurrentWeatherItem,
  LiveQuality,
  Next5DayWeather,
  OneDayEveryHourWeather,
} from './weather.interface'

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name)
  private privateKey: string

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    this.privateKey = this.configService.get<string>('WEATHER_PRIVATE_KEY')
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
   * 当前城市当日天气
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
