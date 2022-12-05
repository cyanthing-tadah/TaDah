import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { ExpressageMapDto } from './expressage.dto'
import { ExpressageService } from './expressage.service'

@Controller('expressage')
@UseInterceptors(TransformResponseInterceptor)
export class ExpressageController {
  constructor(private readonly expressageService: ExpressageService) {}

  /**
   * 根据快递单号查询物流
   * @param num
   */
  @Get('/expressRoad')
  @UseGuards(JwtAuthGuard)
  recognitionExpress(@Query('courierNumber') num: string) {
    return this.expressageService.expressRoad(num)
  }

  /**
   * 查询快递地图
   * @param param
   */
  @Get('/expressMap')
  @UseGuards(JwtAuthGuard)
  findExpressMap(@Query() param: ExpressageMapDto) {
    return this.expressageService.expressMap(param)
  }
}
