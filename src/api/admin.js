import request from '@/libs/request'
import qs from 'qs'

export const getUserList = params => {
  return request.get('/admin/users?' + qs.stringify(params))
}

export const updateUserById = data => {
  return request.post('/admin/update-user', data)
}

export const deleteUserById = id => {
  return request.get(`/admin/delete-user/${id}`)
}

export const checkUserName = username => {
  return request.get('/admin/check-username?username=' + username)
}
