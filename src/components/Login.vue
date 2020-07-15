<template>
  <div class="login">
    <div class="login-beijing">
      <div class="login-top">
        喜递广告监测系统
      </div>
      <div class="login-content">
        <div class="login-login">
          <div class="login-login-top">
            <p>
              喜递广告监测系统
            </p>
          </div>
          <el-form ref="form" :model="form">
            <el-form-item>
              <el-input type="username" placeholder="请输入用户名" v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
            </el-form-item>
          </el-form>
          <div class="btn" @click="login">登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api'
import { setUserInf } from '@/utils/userInf'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        userword: [
          { required: true, message: '请输出用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输出密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    login () {
      console.log('我点击了登录按钮')
      this.$refs.form.validate((valid) => {
        if (valid) {
          login({
            username: this.form.username,
            password: this.form.password
          }).then(data => {
            console.log('data')
            console.log(typeof data.region)
            setUserInf({
              token: data.token,
              region: data.region
            })
            console.log(typeof data.region)
            this.$message({ message: '登录成功', type: 'success', duration: 900 })
            const time = setTimeout(() => {
              this.$router.push({ name: 'index' })
              clearTimeout(time)
            }, 250)
          }).catch(err => {
            this.$message({ message: err.message, type: 'error', duration: 900 })
          })
          // alert('登陆成功')
        } else {
          console.log('失败了')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login {
    height: 100vh;
    width: 100vw;
    .login-beijing {
      position: relative;
      height: 100vh;
      width: 100vw;
      background: url("../assets/login-beijing.png");
      .login-top {
        width: 100%;
        height:80px;
        text-align: center;
        background:rgba(255,255,255,1);
        font-size:30px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:80px;
      }
      .login-content {
        // position: relative;
        // display: flex;
        .login-login {
          position: absolute;
          top: 50%;
          right: 5px;
          right: .533333rem;
          transform: translateY(-50%);
          margin-top: 10  0px;
          margin-top: 20px;
          float: right;
          margin-right: 20px;
          height: auto;
          width:499px;
          width:450px;
          height:486px;
          height:450px;
          background:rgba(255,255,255,1);
          border-radius:10px;
          border:1px solid rgba(151,151,151,1);
            .btn {
              width:300px;
              text-align: center;
              height:50px;
              background:rgba(229,1,19,1);
              border-radius:32px;
              font-size:22px;
              font-family:PingFangSC-Medium,PingFang SC;
              font-weight:500;
              color:rgba(255,255,255,1);
              line-height:50px;
              margin-top: 90px;
              position: relative;
              left:50%;
              transform:translateX(-50%);
            }
          .login-login-top {
            padding-top: 30px;
            p {
              text-align: center;
              line-height: 43px;
              font-size:30px;
              font-family:PingFangSC-Medium,PingFang SC;
              font-weight:500;
              color:rgba(51,51,51,1);
              line-height:42px;
              margin-bottom: 50px;
            }
          }
        }
      }
    }
  }
</style>

<style lang="less">
.login-login {
  .el-input__inner {
    width: 340px;
  }
}
</style>
