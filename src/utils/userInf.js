
let userInf = {
  token: localStorage.getItem('token') || '',
  region: localStorage.getItem('region') || '',
  phone: localStorage.getItem('phone') || ''
}

const getUserInf = () => {
  return userInf
}

const setUserInf = (data) => {
  console.log('setuserinf')
  const { token = '', region = '', phone = '' } = data
  console.log(data)
  localStorage.setItem('token', token)
  localStorage.setItem('region', region === null ? 'null' : region)
  localStorage.setItem('phone', phone)
  userInf.token = token
  userInf.region = region === null ? 'null' : region
  userInf.phone = phone
}

const clearUserInf = () => {
  localStorage.clear()
  userInf = {
    token: '',
    region: '',
    phone: ''
  }
}

export {
  setUserInf,
  getUserInf,
  clearUserInf
}
