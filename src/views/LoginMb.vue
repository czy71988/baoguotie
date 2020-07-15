<template>
  <div class="login mb-mode">
    <div class="img-wrap">
      <img src="@/assets/mb-logo.jpg" alt="">
      <div class="logo-append-wrap">
        <div class="line-over"></div>
        <img class="logo-append" src="@/assets/mb-logo-append.png" alt="">
        <img class="logo-text" src="@/assets/logo-text.png" alt="">
      </div>
      <p class="title">登录</p>
    </div>
    <el-form class="form" ref="form" :model="form" @submit.native.prevent :rules="rules">
      <el-form-item class="predend-icon-item" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" v-pure-number>
          <template slot="prepend"><img class="icon" src="@/assets/phone.png" alt=""></template>
        </el-input>
      </el-form-item>
      <el-form-item class="predend-icon-item" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码">
          <template slot="prepend"><img class="icon" src="@/assets/pwd.png" alt=""></template>
        </el-input>
        <div class="oprate-box">
          <router-link :to="{ name: 'updatePwdMb' }" class="btn">忘记密码</router-link>
          <router-link :to="{ name: 'registerMb' }" class="btn">注册</router-link>
        </div>
      </el-form-item>
      <div class="btn-group">
        <button class="btn" @click="handleLogin">登录</button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mbLogin } from '@/api'
import { setUserInf } from '@/utils/userInf'
export default {
  data () {
    const validatePhone = (rule, value, callback) => {
      if (value && !(/^1\d{10}/.test(value))) {
        return callback(new Error('手机号不正确'))
      }
      return callback()
    }
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleLogin () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          mbLogin({
            phone: this.form.phone,
            password: this.form.password
          }).then(data => {
            this.$message({ message: '登录成功', type: 'success', duration: 900 })
            console.log(data)
            setUserInf({
              token: data.token,
              phone: data.phone
            })
            const time = setTimeout(() => {
              this.$router.push({ name: 'indexMb' })
              clearTimeout(time)
            }, 250)
          }).catch((err) => {
            this.$message({ message: err.message, type: 'error', duration: 900 })
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.el-form-item {
  &.predend-icon-item {
    .el-input-group__prepend {
      padding-left: 0px;
      padding-right: 9px;
      background-color: #ffffff;
      border: none;
      .icon {
        width: 11.55px;
        height: 15.33px;
      }
    }
    .el-input__inner {
      border-radius: 3.3px;
    }
  }
}
.el-message-box {
  width: 95%;
  max-width: 420px;
}
</style>

<style lang="less" scoped>
.mb-mode {
  &.login {
    width: 100%;
    .title {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 1.866667rem;
      // top: 9.12rem;
      font-size:20px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
    }
    .img-wrap {
      position: relative;
      width: 100%;
      .logo-append-wrap {
        width: 100%;
        position: relative;
        .logo-text {
          position: absolute;
          top: -0.30rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          width: 5.6rem;
          width: 8rem;
          width: 7.5rem;
        }
      }
      img {
        width: 100%;
        vertical-align: top;
      }
      .logo-append {
        margin-top: -3px;
        // padding-top: 1px;
        background-color: #fe2a50;
        padding-top: .4rem;
        border: none;
        outline: none;
      }
      .line-over {
        position: absolute;
        height: 2px;
        background-color: #ffffff;
        bottom: -1px;
        width: 100%;
      }
    }
  }
  .form {
    margin-top: -0px;
    box-sizing: border-box;
    padding: 0px 13.67px;
    background-color: #ffffff;
  }
  .oprate-box {
    position: absolute;
    bottom: -22px;
    height: 22px;
    right: 0px;
    line-height: 22px;
    .btn {
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      margin-right: 15px;
      text-decoration: underline;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
}
</style>
<style lang="less">
@media screen and (max-width: 800px) {
  .el-message {
    min-width: 300px;
    .el-icon-error {
      font-size: 15px;
    }
  }
}
</style>
