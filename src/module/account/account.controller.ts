import { BadRequestException, Controller, Get } from '@nestjs/common'

@Controller('account')
export class AccountController {
  @Get('/success')
  testSuccess() {
    return 'success'
  }

  @Get('/failed')
  testFailed() {
    throw new BadRequestException('请求错误')
  }
}
