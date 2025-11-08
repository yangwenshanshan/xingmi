import { baseURL, getToken } from "./config"

const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseURL}${url}`,
      header: {
        Authorization: `Bearer ${getToken()}`
      },
      data,
      method,
      success: (res) => {
        resolve(res.data)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

const http = {
  get: (url, params) => request(url, 'get', params),
  post: (url, data) => request(url, 'post', data),
  patch: (url, data) => request(url, 'patch', data),
}

export default http