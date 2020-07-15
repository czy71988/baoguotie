import request from '@/utils/request'
const baseUrl = 'http://139.196.178.156:8080/'
export function deletePic (id) {
  return request({
    method: 'get',
    url: 'ossAjax/deleteById',
    params: {
      id
    }
  })
}
// 创建用户id [代理报备]
export function createUserId (params = {}) {
  return request({
    method: 'get',
    url: 'admin/user/creatId',
    params
  })
}
export function getPicList (params = {}) {
  return request({
    method: 'get',
    url: 'admin/user/listfile',
    params
  })
}
export function getReportDetail (params = {}) {
  return request({
    method: 'get',
    url: 'admin/user/getByIds',
    params
  })
}
// 登录
export function login (params = {}) {
  return request({
    method: 'get',
    url: 'admin/user/login',
    params
  })
}
// 移动端登录
export function mbLogin (params = {}) {
  return request({
    method: 'get',
    url: 'admin/user/mblogin',
    params
  })
}
// 注册
export function register (params = {}) {
  return request({
    method: 'get',
    url: 'admin/user/zuce',
    params
  })
}
// 修改密码
export function updatePwd (params = {}) {
  return request({
    method: 'get',
    url: 'admin/user/updatepwd',
    params
  })
}
// 获取验证码
export function getIdentifyingCode (params = {}) {
  return request({
    method: 'get',
    url: 'api/code/getcode',
    params
  })
}

//  获取用户列表
export function getUserList (params) {
  return request({
    method: 'get',
    url: 'admin/user/list',
    params
  })
}
// 获取执行用户列表 admin/user/zhixing
export function getZXUserList (params) {
  return request({
    method: 'get',
    url: 'admin/user/zhixing',
    params
  })
}

// 添加报备
export function addReport (params) {
  return request({
    method: 'get',
    url: 'admin/user/register',
    params
  })
}
//  包裹贴报备修改
export function updateReport (params) {
  return request({
    method: 'get',
    url: 'admin/user/update',
    params
  })
}
//  导出报备
export function exportReports (params) {
  const temp = Object.keys(params).map(key => {
    return `${key}=${params[key]}`
  })
  const url = baseUrl + 'admin/user/ExcelDownloads?' + temp.join('&')
  console.group('导出')
  console.log(url)
  console.groupEnd()
  window.open(url)
}

//  快递车报备获取用户列表
export function getUserList1 (params) {
  return request({
    method: 'get',
    url: 'feExpressCar/findAll',
    params
  })
}

//  快递车报备获取ID
export function huoquzhujiankdc (params) {
  return request({
    method: 'get',
    url: 'feExpressCar/creatIdLong',
    params
  })
}

//  快递车报备修改接口
export function KDCxiugai (params) {
  return request({
    method: 'get',
    url: 'feExpressCar/updateFeCar',
    params
  })
}

//  快递车报备新增接口
export function KDCnewdate (params) {
  return request({
    method: 'get',
    url: 'feExpressCar/insertByFeExpressCar',
    params
  })
}
// 查看图片或者视频
export function KDCimgORvideo (params) {
  return request({
    method: 'get',
    url: 'feFile/findAllByFeFile',
    params
  })
}
// 文件新增或者修改接口
export function KDCimgORvideo1 (params) {
  return request({
    method: 'get',
    url: 'feFile/insertOrUpdate',
    params
  })
}

// 文件删除接口 feFile/delete
export function KDCremoveimg (params) {
  return request({
    method: 'get',
    url: 'feFile/delete',
    params
  })
}
