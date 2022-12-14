import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity('weather_city_info')
export class WeatherCityInfoEntity {
  @PrimaryColumn({ unique: true })
  openid: string

  @Column('simple-array')
  cities: { cityCode: string; cityName: string }[]

  @CreateDateColumn()
  updateTime: Date
}
