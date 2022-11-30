import { Injectable } from '@nestjs/common'
import { AccountService } from '../account/account.service'

@Injectable()
export class AuthService {
  constructor(private readonly accountService: AccountService) {}
}

