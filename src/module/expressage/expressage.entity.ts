import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { WexinUserAccountEntity } from '../account/account.entity'

@Entity('express_record_info')
export class ExpressRecordInfoEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('simple-array')
  expressNum: string[]

  @CreateDateColumn()
  updateTime: Date

  @ManyToOne(() => WexinUserAccountEntity, weixinUser => weixinUser.expressRecordInfo)
  weixinUser: WexinUserAccountEntity
}
