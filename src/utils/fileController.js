// 文件控制
const IMG_SIZE = 10000000
const imgSizeTooLarge = (file) => {
  return file.size / 1024 / 1024 > IMG_SIZE
}
export default {
  imgSizeTooLarge,
  IMG_SIZE
}
