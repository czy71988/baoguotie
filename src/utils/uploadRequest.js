import axios from 'axios'
export function uploadRequest ({ file, filename, action, onProgress, onSuccess, onError }) {
  const formdata = new FormData()
  formdata.append(filename, file)
  const config = {
    onUploadProgress: progressEvent => {
      console.log(progressEvent)
      if (typeof onProgress === 'function') {
        onProgress(progressEvent)
      }
      // this.progressPercent = Number((progressEvent.loaded / progressEvent.total * 100).toFixed(2))
    }
  }
  axios.post(action, formdata, config).then(res => {
    if (typeof onSuccess === 'function') onSuccess(res)
  }).catch(err => {
    if (typeof onError === 'function') onError(err)
  })
}
