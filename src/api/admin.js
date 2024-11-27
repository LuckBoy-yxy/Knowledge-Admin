import request from '@/libs/request'
import qs from 'qs'

export const getUserList = params => {
  return request.get('/admin/users?' + qs.stringify(params))
}

export const updateUserById = data => {
  return request.post('/admin/update-user', data)
}

export const updateUserBatchById = data => {
  return request.post('/admin/update-users-set', data)
}

// export const deleteUserById = id => {
//   return request.get(`/admin/delete-user/${id}`)
// }
export const deleteUserById = ids => {
  // return request.post('/admin/delete-user', ids)
  return request.post('/admin/delete-user', {
    ids
  })
}

export const checkUserName = username => {
  return request.get('/admin/check-username?username=' + username)
}

export const addUser = data => {
  return request.post('/admin/add-user', data)
}

export const addMenu = data => {
  return request.post('/admin/add-menu', data)
}

export const updateMenu = data => {
  return request.post('/admin/update-menu', data)
}

export const deleteMenu = data => {
  return request.post('/admin/delete-menu', data)
}

export const getMenu = () => {
  return request.get('/admin/get-menu')
}

export const addRole = data => {
  return request.post('/admin/add-role', data)
}

export const updateRole = data => {
  return request.post('/admin/update-role', data)
}

export const deleteRole = data => {
  return request.post('/admin/delete-role', data)
}

export const getRoles = () => {
  return request.get('/admin/get-roles')
}

export const getRoleNames = () => {
  return request.get('/admin/get-role-names')
}
