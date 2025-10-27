export const baseURL = 'https://xingmi.app.canglandata.com'
// let token = ''
let token = 'Tx24NJznrt8ka1leJvx2Re3-ZgEDSolD'
export function getToken () {
  return token
}
export function setToken (value) {
  token = value
}
export function getUserInfo () {
  const userInfo = uni.getStorageSync('userInfo')
  return userInfo
}