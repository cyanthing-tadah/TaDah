import { Body, Controller, Get, HttpCode, Logger, Post, Query } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WechatValidationOptions } from '../../core/decorators/wechat-validation-options.decorator'
import type { ValidationInterfaces, XMLBaseData } from './wechat.interface'
import { WechatService } from './wechat.service'

@Controller()
export class WechatController {
  constructor(private readonly wechatService: WechatService, private readonly configService: ConfigService) {}

  private readonly logger = new Logger(WechatController.name)

  @Get()
  async validation(@WechatValidationOptions() data: ValidationInterfaces) {
    const validationStr = await this.wechatService.checkSignature(data)

    this.logger.log(validationStr, 'validationStr')

    return validationStr
  }

  @Post()
  @HttpCode(200)
  async handleReceiveMsg(@Body('xml') xml: XMLBaseData) {
    return await this.wechatService.handleReceiveMsg(xml)
  }

  @Get('/appid')
  backUserAppId() {
    return this.configService.get<string>('APP_ID')
  }

  @Post('/accessToken')
  async handleAccessToken(@Query('code') code: string) {
    return await this.wechatService.handleLoadUserAccessToken(code)
  }
}

