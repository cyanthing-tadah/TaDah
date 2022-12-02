export class WeixinAccountDto {
  readonly openid: string

  readonly nickname: string

  readonly headimgurl: string

  readonly email: string

  readonly password: string
}

export class UpdateInfoDto {
  readonly nickname: string

  readonly email: string

  readonly headimgurl: string
}

export class UpdatePasswordDto {
  readonly password: string

  readonly newPassword: string
}
