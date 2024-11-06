import request from '@/libs/request'
import qs from 'qs'

export const getTabData = options => {
  return request.get('/public/list?' + qs.stringify(options))
}

export const deletePostById = id => {
  return request.get('/content/delete?id=' + id)
}

export const updatePostById = data => {
  return request.post('/content/update-id', data)
}
