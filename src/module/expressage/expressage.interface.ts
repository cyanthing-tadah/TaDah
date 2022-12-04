export interface CompanyItem {
  lengthPre: number
  comCode: string
  name: string
}

export interface ExpressInfo {
  result: boolean
  message: string
  nu: string
  ischeck: string
  condition: string
  com: string
  status: string
  state: string
  data: {
    time: string
    ftime: string
    context: string
  }[]
}
