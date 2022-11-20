import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { TallAmountTagEntity, TallyMonthDataEntity } from '../tally/tally.entity'

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

  @OneToMany(() => TallyMonthDataEntity, tallyData => tallyData.weixinUser)
  monthData: TallyMonthDataEntity[]

  @OneToMany(() => TallAmountTagEntity, tallyData => tallyData.weixinUser)
  tallyTag: TallAmountTagEntity[]
}
