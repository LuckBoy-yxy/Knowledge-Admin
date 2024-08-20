import request from '@/libs/request'

export const getCode = sid => {
  return request.get('/public/getCaptcha', {
    params: {
      sid
    }
  })
}

export const login = params => {
  return request.post('/login', params)
}
