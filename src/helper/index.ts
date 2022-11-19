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

/**
 * 处理加载数据库配置
 */
export const handleDBConfig = () => {
  const LOCAL_DB_CONFIG = {
    type: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'TaDah_password123',
    port: 3306,
    database: 'tadah',
  }
  const PROD_DB_CONFIG = {
    type: 'mysql',
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE_NAME,
  }

  return process.env.NODE_ENV === 'prod' ? PROD_DB_CONFIG : LOCAL_DB_CONFIG
}
