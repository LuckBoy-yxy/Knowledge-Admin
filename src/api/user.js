import axios from '@/libs/request'
import { getToken } from '@/libs/util'

export const getUserInfo = () => {
  return axios.get('/public/base-user-info', {
    headers: {
      Authorization: `Bearer ` + getToken()
    }
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
