import baseURL from '@/config/request.config.js'
// const baseUrl = 'https://139.196.170.121:8080/'
const baseUrl = baseURL
const besaurl1 = 'http://10.1.204.121:8081/'
const prefix = process.env.NODE_ENV === 'production' ? baseUrl : 'temp/'
const prefix1 = process.env.NODE_ENV === 'production' ? besaurl1 : 'temp/'
const actions = {
  // uploadBusinessLicense: prefix + 'ossAjax/picturesUpload?findex=business', // 上传
  // uploadFrontIDCard: prefix + 'ossAjax/picturesUpload?findex=cardFront',
  // uploadBackIDCard: prefix + 'ossAjax/picturesUpload?findex=cardbackt',
  // uploadHoldIDCard: prefix + 'ossAjax/picturesUpload?findex=cardhold',
  uploadBusinessLicense: prefix + 'ossAjax/picturesRestUpload?findex=business', // 上传
  uploadFrontIDCard: prefix + 'ossAjax/picturesRestUpload?findex=cardFront',
  uploadBackIDCard: prefix + 'ossAjax/picturesRestUpload?findex=cardbackt',
  uploadHoldIDCard: prefix + 'ossAjax/picturesRestUpload?findex=cardhold',
  updateBusinessLicense: prefix + 'ossAjax/picturesRestUpload?findex=business', // 修改
  updateFrontIDCard: prefix + 'ossAjax/picturesRestUpload?findex=cardFront',
  updateBackIDCard: prefix + 'ossAjax/picturesRestUpload?findex=cardbackt',
  updateHoldIDCard: prefix + 'ossAjax/picturesRestUpload?findex=cardhold',
  uploadHeadPotrait: prefix + 'ossAjax/pictures?findex=headpic', // 上传头像
  uploadHeadPotrait3: prefix + 'ossAjax/pictures?findex=contract', // 上传头像
  // uploadHeadPotrait3: prefix + 'ossAjax/picturesUpload?findex=contract', // 上传头像
  uploadHeadPotrait4: prefix + 'ossAjax/pictures?findex=execute', // 上传头像a
  uploadHeadPotrait1: prefix + 'ossAjax/pictures?findex=headpic1', // 上传头像
  uploadHeadPotrait2: prefix + 'ossAjax/pictures?findex=headpic2', // 上传头像
  uploadGoodsPic: prefix + 'ossAjax/uploadGoodimg?findex=goodimg', // 上传商品图片
  uploadVideo: prefix + 'ossAjax/videoRestUpload?findex=execute', // 上传视频
  uploadCertificater1: prefix + 'ossAjax/pictures?findex=certificater1', // 投放证明 正面特写
  uploadCertificater2: prefix + 'ossAjax/pictures?findex=certificater2', // 投放证明 正在粘贴
  uploadCertificater3: prefix + 'ossAjax/pictures?findex=certificater3', // 投放证明 堆积排列
  kdcimg: prefix1 + 'feFile/insertOrUpdate'
}

export default actions
