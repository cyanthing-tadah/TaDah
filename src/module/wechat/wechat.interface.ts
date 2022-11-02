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
