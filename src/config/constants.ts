export const APP_URL =
  'https://block-mentor-platfrom-web-production.up.railway.app'
export const getVestingeUrl = (tokenAddress: string) =>
  `${APP_URL}/vesting/${tokenAddress}`
