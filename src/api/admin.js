import request from '@/libs/request'
import qs from 'qs'

export const getUserList = params => {
  return request.get('/admin/users?' + qs.stringify(params))
}
