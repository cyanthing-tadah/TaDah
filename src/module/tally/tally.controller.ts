import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthUser } from '../../core/decorators/user.decorator'
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { WexinUserAccountEntity } from '../account/account.entity'
import { TallyService } from './tally.service'

@Controller('tally')
@UseInterceptors(TransformResponseInterceptor)
export class TallyController {
  constructor(private readonly tallyService: TallyService) {}

  /**
   * 查询目标月的消费情况
   * @param user
   */
  @Get('/targetMonthData')
  @UseGuards(JwtAuthGuard)
  currentMonthData(@AuthUser() user: Omit<WexinUserAccountEntity, 'password'>) {
    return this.tallyService.handleFindTargetMonthData(user.openid)
  }

  @Get('/targetMonthList')
  @UseGuards(JwtAuthGuard)
  handleLoadTargetMonthList(@Query('id', ParseIntPipe) id: number) {
    return this.tallyService.handleLoadTargetMonthList(id)
  }

  @Post('/handleSetMonthData')
  @UseGuards(JwtAuthGuard)
  handleSetMonthData(@Query('income', ParseIntPipe) income: number, @Query('target', ParseIntPipe) target: number, @AuthUser() user: Omit<WexinUserAccountEntity, 'password'>) {
    return this.tallyService.handleSetMonthData(income, target, user.openid)
  }

  @Get('/loadTagList')
  @UseGuards(JwtAuthGuard)
  loadTagList(@AuthUser() user: Omit<WexinUserAccountEntity, 'password'>) {
    return this.tallyService.loadTagList(user.openid)
  }

  @Post('/changeOrSetTag')
  @UseGuards(JwtAuthGuard)
  changeOrSetTag(@Query('tagId', ParseIntPipe) tagId: number, @Query('tagName') tagName: string, @Query('emojiName') emojiName: string, @AuthUser() user: Omit<WexinUserAccountEntity, 'password'>) {
    return this.tallyService.changeOrSetTag(tagId, tagName, emojiName, user.openid)
  }

  @Post('/handleAddRecord')
  @UseGuards(JwtAuthGuard)
  handleAddRecord(@Body() data: { year: number; month: number; count: number; description: string; tagId: number; amountType: 0 | 1 }, @AuthUser() user: Omit<WexinUserAccountEntity, 'password'>) {
    return this.tallyService.handleAddRecord({ ...data, openid: user.openid })
  }
}
