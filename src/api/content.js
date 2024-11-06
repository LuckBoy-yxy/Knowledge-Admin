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

export const getTags = options => {
  return request.get('/admin/get-tags?' + qs.stringify(options))
}

export const addTag = data => {
  return request.post('/admin/add-tag', data)
}

export const removeTag = id => {
  return request.get(`/admin/remove-tag/${id}`)
}

export const updateTag = data => {
  return request.post('/admin/edit-tag', data)
}
