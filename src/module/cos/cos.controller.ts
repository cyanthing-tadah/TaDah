import { FileInterceptor } from '@nestjs/platform-express'
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { TransformResponseInterceptor } from '../../core/interceptors/transform-response.interceptor'
import { CosService } from './cos.service'

@Controller('cos')
@UseInterceptors(TransformResponseInterceptor)
export class CosController {
  constructor(private readonly cosService: CosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('headimage'))
  async store(@UploadedFile() data: Express.Multer.File) {
    return await this.cosService.handleUploadToCos(data)
  }
}
