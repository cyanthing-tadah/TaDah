export interface UpdateAccountInfo {
  openid: string
  nickname: string
  email: string
  headimgurl: string
}

export interface UpdateAccountPassword {
  openid: string
  password: string
  newPassword: string
}
