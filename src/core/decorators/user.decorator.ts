import { createParamDecorator } from '@nestjs/common'

export const AuthUser = createParamDecorator((data, req) => req.switchToHttp().getRequest().user)
