import request from '@/libs/request'
import qs from 'qs'

export const getTabData = options => {
  return request.get('/public/list?' + qs.stringify(options))
}
