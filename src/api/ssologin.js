
import requiresso from '@/utils/requiresso'

//获取单点登录用户信息
export function getInfoSSo() {
    return requiresso({
      url: '/getInfoSSo',
      method: 'get'
    })
  }