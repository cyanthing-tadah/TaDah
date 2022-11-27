import { Module } from '@nestjs/common'
import { CosService } from './cos.service'
import { CosController } from './cos.controller'

@Module({
  providers: [CosService],
  controllers: [CosController],
})
export class CosModule {}
