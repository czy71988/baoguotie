var checkPhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('手机号不能为空'))
  } else {
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    console.log(reg.test(value))
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error('请输入正确的手机号'))
    }
  }
}
const rules = {
  username: [
    { required: true, message: '请输入客户名称', trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请选择投放城市', trigger: 'blur' }
  ],
  contractimg: [
    { required: true, message: '请上传合同影印件', trigger: 'blur' }
  ],
  ctprice: [
    { required: true, message: '请输入客户价格', trigger: 'blur' }
  ],
  ctsource: [
    { required: true, message: '请输入客户来源', trigger: 'blur' }
  ],
  dot: [
    { required: true, message: '请输入投放网点', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入合约金额', trigger: 'blur' }
  ],
  contract: [
    { required: true, message: '请输入合同影印件', trigger: 'blur' }
  ],
  number: [
    { required: true, message: '请输入投放数量', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: checkPhone, trigger: 'blur' }
  ]
}

export default rules
