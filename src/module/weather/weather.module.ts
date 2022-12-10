import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WeatherController } from './weather.controller'
import { WeatherCityInfoEntity } from './weather.entity'
import { WeatherService } from './weather.service'

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([WeatherCityInfoEntity])],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
