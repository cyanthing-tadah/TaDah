import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard'
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
  @UseGuards(JwtAuthGuard)
  async searchCity(@Query('keyword') keyword: string) {
    return await this.weatherService.findCity(keyword)
  }

  /**
   * 查询当前天气
   * @param cityCode
   */
  @Get('/currentWeather')
  @UseGuards(JwtAuthGuard)
  async searchCurrentWeather(@Query('cityCode') cityCode: string) {
    return await this.weatherService.currentCityWeather(cityCode)
  }

  /**
   * 查询当前天气
   * @param cityCode
   */
  @Get('/next5dayWeather')
  @UseGuards(JwtAuthGuard)
  async next5dayWeather(@Query('cityCode') cityCode: string) {
    return await this.weatherService.next5dayWeather(cityCode)
  }

  /**
   * 未来城市灾害预警
   * @param cityCode
   */
  @Get('/nextAlarm')
  @UseGuards(JwtAuthGuard)
  async nextAlarm(@Query('cityCode') cityCode: string) {
    return await this.weatherService.nextAlarm(cityCode)
  }

  /**
   * 查询24小时天气
   * @param cityCode
   */
  @Get('/next24HoursWeather')
  @UseGuards(JwtAuthGuard)
  async next24HoursWeather(@Query('cityCode') cityCode: string) {
    return await this.weatherService.next24HoursWeather(cityCode)
  }

  /**
   * 查询空气质量
   * @param cityCode
   */
  @Get('/airQuality')
  @UseGuards(JwtAuthGuard)
  async airQuality(@Query('cityCode') cityCode: string) {
    return await this.weatherService.airQuality(cityCode)
  }

  /**
   * 查询生活指数
   * @param cityCode
   */
  @Get('/liveQuality')
  @UseGuards(JwtAuthGuard)
  async liveQuality(@Query('cityCode') cityCode: string) {
    return await this.weatherService.liveQuality(cityCode)
  }
}
