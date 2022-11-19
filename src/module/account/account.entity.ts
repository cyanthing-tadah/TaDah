import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { TallAmountTagEntity, TallyDataListEntity } from '../tally/tally.entity'

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

  @OneToMany(() => TallyDataListEntity, tallyData => tallyData.weixinUser)
  tallyData: TallyDataListEntity[]

  @OneToMany(() => TallAmountTagEntity, tallyData => tallyData.weixinUser)
  tallyTag: TallAmountTagEntity[]
}
