import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { WexinUserAccountEntity } from '../account/account.entity'

@Entity('tally_amount_tag')
export class TallAmountTagEntity {
  @PrimaryGeneratedColumn()
  tagId: number

  @Column()
  emojiName: string

  @Column()
  tagName: string

  @CreateDateColumn()
  updateTime: Date

  @ManyToOne(() => WexinUserAccountEntity, weixinUser => weixinUser.tallyTag)
  weixinUser: WexinUserAccountEntity

  @OneToMany(() => TallyDataListEntity, tallyList => tallyList.amountTag)
  tallyList: TallyDataListEntity[]
}

@Entity('tally_month_data')
export class TallyMonthDataEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  month: number

  @Column()
  year: number

  @Column({ default: null })
  target: number

  @Column({ default: null })
  income: number

  @OneToMany(() => TallyDataListEntity, tallyList => tallyList.monthData)
  tallyList: TallyDataListEntity[]

  @ManyToOne(() => WexinUserAccountEntity, weixinUser => weixinUser.monthData)
  weixinUser: WexinUserAccountEntity
}

@Entity('tally_data_list')
export class TallyDataListEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => TallAmountTagEntity, amountTag => amountTag.tallyList)
  amountTag: TallAmountTagEntity

  @Column()
  count: number

  @Column()
  amountType: 0 | 1

  @Column({ type: 'text' })
  description: string

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date

  @Column({ default: false })
  delete: boolean

  @ManyToOne(() => TallyMonthDataEntity, monthData => monthData.tallyList)
  monthData: TallyMonthDataEntity
}
