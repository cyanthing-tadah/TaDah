import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

/**
 * 参数装饰期：用于微信公众号配置验证，从query获取关键字串
 */
export const WechatValidationOptions = createParamDecorator((data: unknown, req: ExecutionContext) => {
  const { signature, timestamp, nonce, echostr } = req.switchToHttp().getRequest().query

  return { signature, timestamp, nonce, echostr }
})
