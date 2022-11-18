export interface ValidationInterfaces {
  /* 微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数 */
  signature: string

  /* 时间戳 */
  timestamp: string

  /* 随机数 */
  nonce: string

  /* 随机字符串 */
  echostr: string
}

export interface XMLBaseData {
  /* 消息接收方 ID */
  ToUserName: string

  /* 消息发送方 ID */
  FromUserName: string

  /* 消息发送时间 */
  CreateTime: number

  /* 消息类型 */
  MsgType: 'event' | 'text' | 'image' | 'voice' | 'video' | 'shortvideo' | 'location' | 'link'
}

export interface MessageXMLData extends XMLBaseData {
  /* 消息ID */
  MsgId: number

  /* 文本消息内容 */
  Content: string
}

export interface SubscribeXMLData extends XMLBaseData {
  /* 订阅事件类型：关注 ｜ 取关 */
  Event: 'subscribe' | 'unsubscribe'
}
