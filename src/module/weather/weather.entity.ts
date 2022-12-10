import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { WexinUserAccountEntity } from '../account/account.entity'

@Entity('weather_city_info')
export class WeatherCityInfoEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('simple-array')
  cities: { cityCode: string; cityName: string }[]

  @CreateDateColumn()
  updateTime: Date

  @ManyToOne(() => WexinUserAccountEntity, weixinUser => weixinUser.weatherCityInfo)
  weixinUser: WexinUserAccountEntity
}
