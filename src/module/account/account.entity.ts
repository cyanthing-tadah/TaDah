import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity('weixin_user_account')
export class WexinUserAccountEntity {
  @PrimaryColumn()
  openid: string

  @Column()
  nickname: string

  @Column()
  headimgurl: string

  @CreateDateColumn()
  updateTime: Date

  @Column()
  email: string
}
