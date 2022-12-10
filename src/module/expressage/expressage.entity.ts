import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity('express_record_info')
export class ExpressRecordInfoEntity {
  @PrimaryColumn({ unique: true })
  openid: number

  @Column('simple-array')
  expressNum: string[]

  @CreateDateColumn()
  updateTime: Date
}
