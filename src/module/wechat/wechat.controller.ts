import { Body, Controller, Get, HttpCode, Logger, Post } from '@nestjs/common'
import { WechatValidationOptions } from '../../core/decorators/wechat-validation-options.decorator'
import type { ValidationInterfaces, XMLData } from './wechat.interface'
import { WechatService } from './wechat.service'

@Controller()
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}
  private readonly logger = new Logger(WechatController.name)

  @Get()
  async validation(@WechatValidationOptions() data: ValidationInterfaces) {
    const validationStr = await this.wechatService.checkSignature(data)

    this.logger.log(validationStr, 'validationStr')

    return validationStr
  }

  @Post()
  @HttpCode(200)
  async handleReceiveMsg(@Body('xml') xml: XMLData) {
    return await this.wechatService.handleReceiveMsg(xml)
  }
}

