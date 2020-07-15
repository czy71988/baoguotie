
let baseURL = 'http://139.196.178.156:8080/'
// let baseURL = 'https://ht.hongrendaihuo.com:8080/'
if (process.env.NODE_ENV === 'production') {
  baseURL = 'http://139.196.178.156:8080/'
  // baseURL = 'https://ht.hongrendaihuo.com:8080/'
}
export default baseURL
