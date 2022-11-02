import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    const message = exception.message

    Logger.error(message, '响应错误提示')

    const errorResponse = {
      data: { error: message },
      message: '请求失败',
      url: request.originalUrl,
    }

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    response.status(status)
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send(errorResponse)
  }
}
