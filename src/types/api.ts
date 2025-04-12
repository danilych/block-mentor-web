export interface ApiVesting {
  id: string
  blockTimestamp: string
  token_name: string
  token_ticker: string
  amount: string
  total_periods: string
  period_duration: string
  start_timestamp: string
  token_address: string
  owner: string
  webpage?: string
}

export interface ApiToken {
  id: string
  blockTimestamp: string
  initialAmount: string
  name: string
  ticker: string
  owner: string
  token_address: string
}
