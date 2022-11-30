import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Exclude } from 'class-transformer'
import * as bcrypt from 'bcrypt'
import { TallAmountTagEntity, TallyMonthDataEntity } from '../tally/tally.entity'

@Entity('weixin_user_account')
export class WexinUserAccountEntity {
  @PrimaryColumn({ unique: true })
  openid: string

  @Column('varchar')
  nickname: string

  /* 用户密码 */
  @Column('longtext', { nullable: true })
  @Exclude()
  password: string

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

  /**
   * 插入前对密码hash
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = this.password ? await bcrypt.hash(this.password, 12) : null
  }

  /**
   * 更新密码时比对
   * @param password
   */
  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password)
  }
}
