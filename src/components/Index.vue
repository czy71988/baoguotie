<template>
  <div class="index">
    <el-container>
      <el-header>
        <span class="span1">喜递广告监测系统</span>
        <span class="region-name">{{region === 'null' || region === null ? '总部' : (region || '三通一达')}}</span>
        <a class="logout-btn" @click="handleLogout">退出</a>
      </el-header>
      <el-container>
        <el-aside class="side-bar">
          <!-- ---------------------------------------------------------------- -->
              <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                text-color="#333333"
                active-text-color="#3776eb"
                router>
                <div id="yr">
                  <div class="jsdhifvibv">三通一达</div>
                  <el-menu-item index="dailibaobei" :route="{name:'dailibaobei'}">
                    <i class="el-icon-menu"></i>
                    <span slot="title">代理报备</span>
                  </el-menu-item>
                  <el-menu-item index="kehubaobei" :route="{name:'kehubaobei'}">
                    <i class="el-icon-menu"></i>
                    <span slot="title">业务报备</span>
                  </el-menu-item>
                </div>
                <div id="yy">
                  <div class="jsdhifvibv">区域公司</div>
                  <el-menu-item index="zhixingbaobei" :route="{name:'zhixingbaobei'}">
                    <i class="el-icon-menu"></i>
                    <span slot="title">包裹贴报备</span>
                  </el-menu-item>
                  <el-menu-item index="expressCarReport" :route="{name:'expressCarReport'}">
                    <i class="el-icon-menu"></i>
                    <span slot="title">快递车报备</span>
                  </el-menu-item>
                </div>
                <div id="head">
                  <div class="jsdhifvibv">中快总部</div>
                  <el-menu-item index="zhikebaobei" :route="{name:'zhikebaobei'}">
                    <i class="el-icon-menu"></i>
                    <span slot="title">直客报备</span>
                  </el-menu-item>
                </div>
              </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getUserInf, clearUserInf } from '@/utils/userInf'
console.log(JSON.stringify(getUserInf().region))
export default {
  data: function () {
    return {
      region: getUserInf().region
    }
  },
  created () {
    this.region = getUserInf().region
    console.log(getUserInf())
    console.log(this.region)
  },
  mounted () {
    this.yyyy()
  },
  beforeRouteEnter (to, from, next) {
    if (getUserInf().token) {
      next()
      return
    }
    next({ name: 'login' })
  },
  methods: {
    handleLogout () {
      clearUserInf()
      this.$router.push({ name: 'login' })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    yyyy () {
      const region = getUserInf().region
      if (region === '三通一达') {
        document.getElementById('yr').style.display = 'inline'
        document.getElementById('yy').style.display = 'none'
        document.getElementById('head').style.display = 'none'
      } else if (region === 'null' || region === null) { // 中部
        document.getElementById('yy').style.display = 'inline'
        document.getElementById('yr').style.display = 'inline'
        document.getElementById('head').style.display = 'inline'
      } else { // 区域
        document.getElementById('head').style.display = 'none'
        document.getElementById('yy').style.display = 'inline'
        document.getElementById('yr').style.display = 'none'
      }
    }
  }
}
</script>

<style lang='less'>
.side-bar {
  &.el-aside {
    // width: 200px !important;
    width: 160px !important;
  }
}
li {
  list-style: none;
}
button {
  list-style: none;
}
  .index {
    .el-submenu__title {
      font-size:22px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(102,102,102,1);
      line-height:30px;
    }
    .el-menu-item {
      font-size:18px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(153,153,153,1);
      // line-height:28px;
    }
  }
  .el-header, .el-footer {
    /* background-color: rgb(27, 194, 102); */
    color: #333;
    /* text-align: center; */
    line-height: 60px;
    width:1920px;
    height:80px;
    background:rgba(255,255,255,1);
  }

  .el-aside {
    color: #333;
    /* text-align: center; */
    // line-height: 200px;
    height: calc(100vh - 60px);
    padding-top: 30px;
    box-sizing: border-box;
  }

  .el-main {
    /* background-color: rgb(223, 47, 214); */
    color: #333;
    /* text-align: center; */
    // line-height: 160px;
    height: calc(100vh - 60px);
    background: rgba(0,0,0,0.3);
    background-image: url('../assets/index-beijing.png');
    padding: 2px !important;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>

<style lang="less" scoped>
.region-name {
  width:100%;
  margin-left: 20px;
  text-align: center;
  height:42px;
  font-size:22px;
  font-family:PingFangSC-Regular,PingFang SC;
  line-height:60px;
  color: burlywood;
}
.logout-btn {
  font-size: 20px;
  // float: right;
  margin-left: 20px;
  color: burlywood;
  cursor: pointer;
  text-decoration: underline;
}
.jsdhifvibv {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  padding-left: 30px;
  box-sizing: border-box;
}
.jsbvs {

font-size:22px;
font-family:PingFangSC-Medium,PingFang SC;
font-weight:500;
color:rgba(102,102,102,1);
line-height:30px
}
.skjdbvisdbv {
  font-size:24px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:33px;
}
.span1{
  // margin-left: 50px;
  width:100%;
  text-align: center;
  height:42px;
  font-size:30px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:60px;
}
.span2 {
  float: right;
  // width:40px;
  // height:28px;
  font-size:20px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(102,102,102,1);
  line-height:60px;
}
.span3 {
  margin-right: 40px;
}
.span4 {
  margin-right: 400px;
}
</style>
