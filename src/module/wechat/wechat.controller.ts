import { Controller, Get, Logger } from '@nestjs/common'
import { WechatValidationOptions } from '../../core/decorators/wechat-validation-options.decorator'
import { WechatService } from './wechat.service'
import type { ValidationInterfaces } from './wechat.interface'

@Controller()
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  @Get()
  async validation(@WechatValidationOptions() data: ValidationInterfaces) {
    const validationStr = await this.wechatService.checkSignature(data)

    Logger.log(validationStr, '=========validationStr=========')

    return validationStr
  }
}

