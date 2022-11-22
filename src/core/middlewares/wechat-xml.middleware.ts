import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as bodyParser from 'body-parser'
import * as bodyParserXml from 'body-parser-xml'

bodyParserXml(bodyParser)

/**
 * wechat message XML => object
 */
@Injectable()
export class WechatXmlMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    bodyParser.xml({ xmlParseOptions: { explicitArray: false } })(req, res, next)
  }
}
