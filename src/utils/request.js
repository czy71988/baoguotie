import axios from 'axios'
import { getUserInf } from '@/utils/userInf'
import { MessageBox } from 'element-ui'
import router from '@/router/index'
import device from '@/utils/device'
// alert(getUserInf)
const IS_DEVLOPMENT_ENV = process.env.NODE_ENV === 'development'
const whiteUrlList = ['/login', '/updatepwd', '/mblogin', '/getcode', 'register']
const isInWhiteUrlList = (url) => {
  let flag = false
  whiteUrlList.every(item => {
    if (url.indexOf(item) > -1) {
      flag = true
      return false
    }
    return true
  })
  return flag
}
const request = (config = { method: 'get', params: {}, query: {}, url: '' }) => {
  // 开发环境不是以url中api/开头的，需要再url前加temp/，进行代理，解决跨域问题
  if (IS_DEVLOPMENT_ENV && config.url.indexOf('ap1i/') < 0) {
    config.url = 'temp/' + config.url
  }
  return new Promise((resolve, reject) => {
    // 不在白名单的需加入token验证
    if (!isInWhiteUrlList(config.url)) {
      console.log(getUserInf().token)
      config.params.token || (config.params.token = getUserInf().token)
      console.log(config.token)
    }
    // console.log(config.url)
    axios(config).then(({ data }) => {
      // if (data.success || data.code === 1000 || data.code === '1000' || !data.code) {
      if ((data.code && data.code.toString() === '99999') || data.msg === 'token失效') {
        // Mess({ message: '登录成功', type: 'success', duration: 900 })
        // alert('dd')
        MessageBox({
          title: '提示',
          message: '身份过期，请重新登录',
          confirmButtonText: '去登录',
          showCancelButton: false,
          showClose: false,
          closeOnPressEscape: false,
          closeOnClickModal: false,
          center: true
        }).then(() => {
          router.push({ name: device.isMobile ? 'loginMb' : 'login' })
        })
        // reject(new Error(data.msg))
        return
      }
      if (data.success) {
      // console.log(data)
        resolve(data.data)
      } else {
        reject(new Error(data.msg))
      }
    }).catch(err => {
      reject(err)
    })
  })
}

export default request
