import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as bodyParser from 'body-parser'
import * as bodyParserXml from 'body-parser-xml'

bodyParserXml(bodyParser)

/**
 * 处理微信发来的 XML 格式信息为JSON格式
 */
@Injectable()
export class WechatXmlMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    bodyParser.xml({ xmlParseOptions: { explicitArray: false } })(req, res, next)
  }
}
