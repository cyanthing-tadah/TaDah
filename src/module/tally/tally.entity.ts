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

@Entity('tally_data_list')
export class TallyDataListEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => TallAmountTagEntity, amountTag => amountTag.tallyList)
  amountTag: TallAmountTagEntity

  @Column()
  count: number

  @Column({ type: 'text' })
  description: string

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date

  @ManyToOne(() => WexinUserAccountEntity, weixinUser => weixinUser.tallyData)
  weixinUser: WexinUserAccountEntity
}
