import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity('express_record_info')
export class ExpressRecordInfoEntity {
  @PrimaryColumn({ unique: true })
  openid: string

  @Column('simple-array')
  expressNum: string[]

  @CreateDateColumn()
  updateTime: Date
}
