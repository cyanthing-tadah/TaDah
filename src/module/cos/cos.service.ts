import { writeFileSync } from 'fs'
import { join } from 'path'
import { ConfigService } from '@nestjs/config'
import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common'
import * as COS from 'cos-nodejs-sdk-v5'

@Injectable()
export class CosService implements OnModuleInit {
  private cos: COS

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.cos = new COS({
      SecretId: this.configService.get<string>('SECRET_ID'),
      SecretKey: this.configService.get<string>('SECRET_KEY'),
    })
  }

  /**
   * 上传头像到 COS
   * @param fileData
   */
  async handleUploadToCos(fileData: Express.Multer.File) {
    const filePath = join(__dirname, '..', '../static', `${fileData.originalname}`)
    writeFileSync(filePath, fileData.buffer)

    const { statusCode, Location } = await this.cos.uploadFile({
      FilePath: filePath,
      Bucket: this.configService.get<string>('BUCKET'),
      Region: this.configService.get<string>('REGION'),
      Key: fileData.fieldname,
    })
    // TODO 无论成功与否，删除本地临时文件
    if (statusCode === 200) {
      return `https://${Location}`
    }
    throw new HttpException('图片上传错误', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
