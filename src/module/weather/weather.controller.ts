import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { WeatherService } from './weather.service'

@Controller('weather')
@UseInterceptors(TransformResponseInterceptor)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * 查询城市
   * @param keyword
   */
  @Get('/city')
  async searchCity(@Query('keyword') keyword: string) {
    return await this.weatherService.findCity(keyword)
  }

  /**
   * 查询当前天气
   * @param cityCode
   */
  @Get('/currentWeather')
  async searchCurrentWeather(@Query('cityCode') cityCode: string) {
    return await this.weatherService.currentCityWeather(cityCode)
  }

  /**
   * 查询24小时天气
   * @param cityCode
   */
  @Get('/next24HoursWeather')
  async next24HoursWeather(@Query('cityCode') cityCode: string) {
    return await this.weatherService.next24HoursWeather(cityCode)
  }

  /**
   * 查询空气质量
   * @param cityCode
   */
  @Get('/airQuality')
  async airQuality(@Query('cityCode') cityCode: string) {
    return await this.weatherService.airQuality(cityCode)
  }

  /**
   * 查询生活指数
   * @param cityCode
   */
  @Get('/liveQuality')
  async liveQuality(@Query('cityCode') cityCode: string) {
    return await this.weatherService.liveQuality(cityCode)
  }
}
