import { Body, Controller, Get, HttpCode, Logger, Post } from '@nestjs/common'
import { WechatValidationOptions } from '../../core/decorators/wechat-validation-options.decorator'
import { WechatService } from './wechat.service'
import type { ValidationInterfaces } from './wechat.interface'

interface XML {
  ToUserName: string
  FromUserName: string
  CreateTime: number
  MsgType: 'event'
  Event: 'subscribe' | 'unsubscribe'
}

@Controller()
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  @Get()
  async validation(@WechatValidationOptions() data: ValidationInterfaces) {
    const validationStr = await this.wechatService.checkSignature(data)

    Logger.log(validationStr, '=========validationStr=========')

    return validationStr
  }

  @Post()
  @HttpCode(200)
  handleReceiveMsg(@Body('xml') xml: XML) {
    return this.wechatService.handleReceiveMsg(xml)
  }
}

