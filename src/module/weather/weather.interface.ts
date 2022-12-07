export interface CityListItem {
  id: string
  name: string
  country: string
  path: string
  timezone: string
  timezone_offset: string
}

export interface CurrentWeatherItem {
  location: CityListItem
  now: {
    text: string // 天气现象文字
    code: string // 天气现象代码
    temperature: string // 温度，单位为c摄氏度或f华氏度
    feels_like: string // 体感温度，单位为c摄氏度或f华氏度
    pressure: string // 气压，单位为mb百帕或in英寸
    humidity: string // 相对湿度，0~100，单位为百分比
    visibility: string // 能见度，单位为km公里或mi英里
    wind_direction: string // 风向文字
    wind_direction_degree: string // 风向角度，范围0~360，0为正北，90为正东，180为正南，270为正西
    wind_speed: string // 风速，单位为km/h公里每小时或mph英里每小时
    wind_scale: string // 风力等级，请参考：http://baike.baidu.com/view/465076.htm
    clouds: string // 云量，单位%，范围0~100，天空被云覆盖的百分比 #目前不支持中国城市#
  }
  last_update: string // 数据更新时间（该城市的本地时间）
}

export interface NextAlarmItem { // 当前全国或指定城市的气象灾害预警数组
  location: CityListItem
  alarms: { // 该城市所有的灾害预警数组
    alarm_id: string // 预警唯一ID，可用于去重
    title: string
    type: string
    level: string
    region_id: string // 国家行政区划编码
    status: string // V3版本默认为空
    description: string
    pub_date: string // 各级政府发布预警时间
  }[]
}

export interface Next5DayWeather {
  location: CityListItem
  daily: { // 返回指定days天数的结果
    date: string // 日期（该城市的本地时间）
    text_day: string // 白天天气现象文字
    code_day: string // 白天天气现象代码
    text_night: string // 晚间天气现象文字
    code_night: string // 晚间天气现象代码
    high: string // 当天最高温度
    low: string // 当天最低温度
    precip: string // 降水概率，范围0~100，单位百分比（目前仅支持国外城市）
    wind_direction: string // 风向文字
    wind_direction_degree: string // 风向角度，范围0~360
    wind_speed: string // 风速，单位km/h（当unit=c时）、mph（当unit=f时）
    wind_scale: string // 风力等级
    rainfall: string // 降水量，单位mm
    humidity: string // 相对湿度，0~100，单位为百分比
  }[]
  last_update: string // 数据更新时间（该城市的本地时间）
}

export interface OneDayEveryHourWeather {
  location: CityListItem
  hourly: { // 逐小时天气预报数组，数量可由start和hours参数控制，最多24个对象。
    time: string // 时间
    text: string // 天气现象文字
    code: string // 天气现象代码
    temperature: string // 温度，单位为c摄氏度或f华氏度
    humidity: string // 相对湿度，0~100，单位为百分比
    wind_direction: string // 风向
    wind_speed: string // 风速，单位为km/h公里每小时或mph英里每小时
  }[]
}

export interface AirQuality {
  location: CityListItem
  air: {
    city: {
      aqi: string // 空气质量指数(AQI)是描述空气质量状况的定量指数
      pm25: string // PM2.5颗粒物（粒径小于等于2.5μm）1小时平均值。单位：μg/m³
      pm10: string // PM10颗粒物（粒径小于等于10μm）1小时平均值。单位：μg/m³
      so2: string // 二氧化硫1小时平均值。单位：μg/m³
      no2: string // 二氧化氮1小时平均值。单位：μg/m³
      co: string // 一氧化碳1小时平均值。单位：mg/m³
      o3: string // 臭氧1小时平均值。单位：μg/m³
      primary_pollutant: string // 首要污染物
      quality: string // 空气质量类别，有“优、良、轻度污染、中度污染、重度污染、严重污染”6类
    }
  }
  last_update: string
}

export interface LiveQuality {
  location: CityListItem
  suggestion: {
    ac: {
      // 空调开启
      brief: string // 简要建议
      details: string // 详细建议
    }
    air_pollution: {
      // 空气污染扩散条件
      brief: string
      details: string
    }
    airing: {
      // 晾晒
      brief: string
      details: string
    }
    allergy: {
      // 过敏
      brief: string
      details: string
    }
    beer: {
      // 啤酒
      brief: string
      details: string
    }
    boating: {
      // 划船
      brief: string
      details: string
    }
    car_washing: {
      // 洗车
      brief: string
      details: string
    }
    chill: {
      // 风寒
      brief: string
      details: string
    }
    comfort: {
      // 舒适度
      brief: string
      details: string
    }
    dating: {
      // 约会
      brief: string
      details: string
    }
    dressing: {
      // 穿衣
      brief: string
      details: string
    }
    fishing: {
      // 钓鱼
      brief: string
      details: string
    }
    flu: {
      // 感冒
      brief: string
      details: string
    }
    hair_dressing: {
      // 美发
      brief: string
      details: string
    }
    kiteflying: {
      // 放风筝
      brief: string
      details: string
    }
    makeup: {
      // 化妆
      brief: string
      details: string
    }
    mood: {
      // 心情
      brief: string
      details: string
    }
    morning_sport: {
      // 晨练
      brief: string
      details: string
    }
    night_life: {
      // 夜生活
      brief: string
      details: string
    }
    road_condition: {
      // 路况
      brief: string
      details: string
    }
    shopping: {
      // 购物
      brief: string
      details: string
    }
    sport: {
      // 运动
      brief: string
      details: string
    }
    sunscreen: {
      // 防晒
      brief: string
      details: string
    }
    traffic: {
      // 交通
      brief: string
      details: string
    }
    travel: {
      // 旅游
      brief: string
      details: string
    }
    umbrella: {
      // 雨伞
      brief: string
      details: string
    }
    uv: {
      // 紫外线
      brief: string
      details: string
    }
  }
  last_update: string
}
