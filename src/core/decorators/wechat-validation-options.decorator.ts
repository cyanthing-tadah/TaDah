import type { ExecutionContext } from '@nestjs/common'
import { Logger, createParamDecorator } from '@nestjs/common'

/**
 * 参数装饰期：用于微信公众号配置验证，从query获取关键字串
 */
export const WechatValidationOptions = createParamDecorator((data: unknown, req: ExecutionContext) => {
  const { signature, timestamp, nonce, echostr } = req.switchToHttp().getRequest().query

  Logger.log(signature, '公众号注册开发验证 signature')
  Logger.log(echostr, '公众号注册开发验证 echostr')
  Logger.log(timestamp, '公众号注册开发验证 timestamp')
  Logger.log(nonce, '公众号注册开发验证 nonce')

  return { signature, timestamp, nonce, echostr }
})
