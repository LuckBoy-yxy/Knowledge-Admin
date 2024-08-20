import axios from 'axios'
import errorHandle from './errorHandle'
import store from '@/store'
import publicConfig from '@/config'

const CancelToken = axios.CancelToken

class HttpRequest {
  constructor (baseURL) {
    this.baseURL = baseURL
    this.pending = {}
  }

  removePending (key, isRequest = false) {
    if (this.pending[key] && isRequest) {
      this.pending[key]('取消重复请求')
    }
    delete this.pending[key]
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      timeout: 10000
    }

    return config
  }

  interceptors (instance) {
    instance.interceptors.request.use(config => {
      const key = config.url + '&' + config.method
      this.removePending(key, true)
      config.cancelToken = new CancelToken(c => {
        this.pending[key] = c
      })

      let isPublic = false
      publicConfig.publicPath.forEach(path => {
        isPublic = path.test(config.url) || isPublic
      })
      const token = store.state.userInfo ? store.state.userInfo.token : ''
      if (token && !isPublic) {
        config.headers = {
          Authorization: 'Bearer ' + store.state.userInfo.token
          // 'Content-Type': 'application/json'
        }
      }
      return config
    }, err => {
      errorHandle(err)
      return Promise.reject(err)
    })

    instance.interceptors.response.use(res => {
      const key = res.config.url + '&' + res.config.method
      this.removePending(key)
      if (res.status === 200) {
        return Promise.resolve(res.data)
      } else {
        return Promise.reject(res)
      }
    }, err => {
      console.log(err)
      errorHandle(err)
      return Promise.reject(err)
    })
  }

  request (options) {
    const instance = axios.create()
    const newOptions = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance)

    return instance(newOptions)
  }

  get (url, config) {
    const options = Object.assign({
      method: 'get',
      url
    }, config)

    return this.request(options)
  }

  post (url, data) {
    return this.request({
      method: 'post',
      url,
      data: data
    })
  }
}

export default HttpRequest

// import axios from 'axios'
// import store from '@/store'
// // import { Spin } from 'iview'

// class HttpRequest {
//   constructor (baseUrl = baseURL) {
//     this.baseUrl = baseUrl
//     this.queue = {}
//   }
//   getInsideConfig () {
//     const config = {
//       baseURL: this.baseUrl,
//       headers: {
//         //
//       }
//     }
//     return config
//   }
//   destroy (url) {
//     delete this.queue[url]
//     if (!Object.keys(this.queue).length) {
//       // Spin.hide()
//     }
//   }
//   interceptors (instance, url) {
//     // 请求拦截
//     instance.interceptors.request.use(config => {
//       // 添加全局的loading...
//       if (!Object.keys(this.queue).length) {
//         // Spin.show() // 不建议开启，因为界面不友好
//       }
//       this.queue[url] = true
//       return config
//     }, error => {
//       return Promise.reject(error)
//     })
//     // 响应拦截
//     instance.interceptors.response.use(res => {
//       this.destroy(url)
//       const { data, status } = res
//       return { data, status }
//     }, error => {
//       this.destroy(url)
//       let errorInfo = error.response
//       if (!errorInfo) {
//         const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
//         errorInfo = {
//           statusText,
//           status,
//           request: { responseURL: config.url }
//         }
//       }
//       addErrorLog(errorInfo)
//       return Promise.reject(error)
//     })
//   }
//   request (options) {
//     const instance = axios.create()
//     options = Object.assign(this.getInsideConfig(), options)
//     this.interceptors(instance, options.url)
//     return instance(options)
//   }
// }
// export default HttpRequest
