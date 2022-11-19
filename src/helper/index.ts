import { create } from 'xmlbuilder2'
import { XMLBaseData } from '../module/wechat/wechat.interface'

/**
 * 返回文本消息公用方法
 * @param xml
 * @param content
 */
export const handleReturnTextMessage = (xml: XMLBaseData, content: string): string => {
  return create({
    xml: {
      ToUserName: xml.FromUserName,
      FromUserName: xml.ToUserName,
      CreateTime: new Date().getTime(),
      MsgType: 'text',
      Content: content,
    },
  }).end({ prettyPrint: true })
}
