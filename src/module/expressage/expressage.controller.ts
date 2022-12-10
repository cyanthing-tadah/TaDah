import { Controller, Delete, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthUser } from '../../core/decorators/user.decorator'
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { WexinUserAccountEntity } from '../account/account.entity'
import { ExpressageMapDto } from './expressage.dto'
import { ExpressageService } from './expressage.service'

@Controller('expressage')
@UseInterceptors(TransformResponseInterceptor)
export class ExpressageController {
  constructor(private readonly expressageService: ExpressageService) {}

  /**
   * 查询当前用户所有存储的物流单对应的物流信息
   * @param user
   */
  @Get('/findAllExpressInfo')
  @UseGuards(JwtAuthGuard)
  findAllExpressInfo(@AuthUser() user: Omit<WexinUserAccountEntity, 'password'>) {
    return this.expressageService.findAllExpressInfo(user.openid)
  }

  /**
   * 当前用户存储一个物流单
   * @param courierNumber
   * @param user
   */
  @Post('/addExpressRecord')
  @UseGuards(JwtAuthGuard)
  addExpressRecord(@Query('courierNumber') courierNumber: string, @AuthUser() user: Omit<WexinUserAccountEntity, 'password'>) {
    return this.expressageService.addExpressRecord(courierNumber, user.openid)
  }

  /**
   * 当前用户删除一个物流单
   * @param courierNumber
   * @param user
   */
  @Delete('/deleteExpressRecord')
  @UseGuards(JwtAuthGuard)
  deleteExpressRecord(@Query('courierNumber') courierNumber: string, @AuthUser() user: Omit<WexinUserAccountEntity, 'password'>) {
    return this.expressageService.deleteExpressRecord(courierNumber, user.openid)
  }

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
