<template>
  <div class="index mb-mode">
    <nav class="nav">
      <img class="user-pic" src="@/assets/user.png" alt="">
      <span class="user-name">{{phone}}</span>
      <button class="btn" @click="handleLogout">退出</button>
    </nav>
    <div class="img-wrap">
      <img src="@/assets/index-logo.jpg" alt="">
    </div>
    <!-- <p style="font-size: 16px;color: #888; text-align: center;padding: 10px 0px;">快递车报备</p> -->
    <!-- <button @click="showPopup = true">搜索</button> -->
    <div class="bd box">
      <div class="box-item clearfix" v-if="isAdmin">
        <div class="control-prepend">
          <img class="icon" src="@/assets/user.png" alt="">
          <label class="label" for="">客户名称：</label>
        </div>
        <div class="control large">
          <el-input placeholder="请输入客户名称" class="user-name-input" v-model="form.username"></el-input>
        </div>
        <div class="control-append">
          <el-button type="primary" @click="handleSearchByUserName">搜索</el-button>
        </div>
      </div>
      <div class="box-item clearfix" v-if="isAdmin">
        <div class="control-prepend">
          <img class="icon" src="@/assets/phone.png" alt="">
          <label class="label" for="">手机号：</label>
        </div>
        <div class="control large">
          <el-input v-model="form.phone" disabled placeholder="请确认手机号"></el-input>
        </div>
      </div>
      <div class="box-item clearfix">
        <div class="control-prepend">
          <img class="icon" src="@/assets/city-icon.png" alt="">
          <label class="label" for="">投放城市：</label>
        </div>
        <div class="control col-2">
          <el-select v-model="form.province" placeholder="请选择省份" @change="handleProvinceChange">
            <el-option
              v-for="(item, index) in provinceList"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="form.city" placeholder="请选择城市" @change="handleCityChange">
            <el-option
              v-for="(item, index) in citySet"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="box-item clearfix">
        <div class="control-prepend">
          <img class="icon" src="@/assets/date-icon.png" alt="">
          <label class="label" for="" format="yyyy-MM-dd" value-format="yyyy-MM-dd">投放日期：</label>
        </div>
        <div class="control date">
          <el-select v-model="form.dttime" placeholder="请选择投放日期" @change="handleDttimeChange">
            <el-option
              v-for="(item, index) in dttimeSet"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="box-item clearfix">
        <div class="control-prepend">
          <img class="icon" src="@/assets/netdot-icon.png" alt="">
          <label class="label" for="">投放网点：</label>
        </div>
        <div class="control large">
          <el-select v-model="form.dot" placeholder="请选择网点" @change="handleNetdotChange">
            <el-option
              v-for="(item, index) in netdotSet"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      <div v-show="item.username">
        <div class="box-item clearfix">
          <div class="control-prepend">
            <img class="icon" src="@/assets/number-icon.png" alt="">
            <label class="label" for="">投放数量：</label>
          </div>
          <div class="control value">
            {{item.number}}
          </div>
        </div>
        <div class="box-item clearfix">
          <div class="control-prepend">
            <img class="icon" src="@/assets/pic-icon.png" alt="">
            <label class="label width-auto" for="">图片证明：</label>
          </div>
        </div>
        <div class="pic-display">
          <ul class="list scroll clearfix">
            <li class="list__item" v-for="(item, index) in contractimgList" :key="index" @click="handleShowPicGallary(contractimgList, index)">
              <img class="pic" :src="item">
            </li>
          </ul>
          <div class="side-bar-more">
            <img src="@/assets/more1.png" alt="">
          </div>
        </div>
      </div>
      </div>
    <!-- <div class="mask" :class="showMask ? 'show' : ''" ref="mask"></div> -->
    <van-image-preview v-model="showPicGallary" :images="picGallaryList" :startPosition="gallaryActiveItem" :maxZoom="2">
    </van-image-preview>
    <van-popup v-model="showPopup" position="right" :style="{ width: '100%', height: '100%' }">
      <div class="popup-hd">
        <el-button type="text" @click="showPopup = false">取消</el-button>
        <el-button type="text" @click="handleSelectedUserOk">确认</el-button>
      </div>
      <van-list
        class="user-list"
        v-model="loading"
        :finished="total <= currentFetchTotal"
        finished-text="没有更多了"
        @load="handleLoadUserList">
        <!-- <van-cell v-for="item in userList" :key="item.id" :title="item.phone" /> -->
        <div class="user-list__item" :class="selectedUserItem === item ? 'active' : ''" v-for="item in userList" :key="item.id" @click="selectedUserItem = item">
          <span class="name">{{item.username}}</span>
          <span class="phone">{{item.phone}}</span>
        </div>
      </van-list>
      <!-- <p class="center" style="text-align: center;color: #888;font-size: 18px">没有数据</p> -->
    </van-popup>
  </div>
</template>

<script>
// import { getProvinceList, getCityListFromProvinceName } from '@/components/uitl/jsAddress'
// import { getCityListFromProvinceName } from '@/components/uitl/jsAddress'
import { getPicList, getZXUserList, getReportDetail } from '@/api/index'
import { getUserInf } from '@/utils/userInf'
export default {
  data () {
    return {
      minDate: new Date(1995, 0, 1),
      currentDate: new Date(),
      showDatePicker: false,
      cityList: null,
      dttimeList: null,
      netdotList: [], // 网点列表
      item: {},
      showMask: false, // 显示遮罩
      showPicGallary: false, // 显示图片展览
      username: '',
      showPopup: false,
      form: {
        username: '',
        province: '',
        city: '',
        dot: '',
        dttime: '',
        userType: 5,
        phone: '',
        page: 1,
        row: 40
      },
      selectedUserItem: '',
      page: {
        page: 1,
        row: 40
      },
      phone: localStorage.getItem('phone'),
      isAdmin: false,
      gallaryActiveItem: 0,
      scaleItem: '',
      img: {
        width: '900h',
        height: '90vw'
      },
      userList: [],
      userPickerColumns: null,
      phoneList: null,
      provinceList: null,
      citySet: null,
      dttimeSet: null,
      netdotSet: null,
      contractimgList: [], // 图片证明列表
      picGallaryList: null,
      total: 0,
      currentFetchTotal: 0, // 当前拉起的条数
      finished: false,
      loading: false
    }
  },
  beforeRouteEnter (to, from, next) {
    if (getUserInf().token) {
      next()
      return
    }
    next({ name: 'loginMb' })
  },
  created () {
    document.title = '快递车喜递广告监测系统'
    const phone = localStorage.getItem('phone')
    if (this.$user.isAdmin(phone)) {
      this.isAdmin = true
      // this.getPhoneList()
    } else {
      this.search({
        phone
      })
    }
  },
  watch: {
    showPicGallary (val) {
      // 图片预览的时候， 禁止左滑页面后退
      if (val) {
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', this.handlePopstate)
      } else {
        // history.back()
        window.removeEventListener('popstate', this.handlePopstate)
      }
    }
  },
  methods: {
    handleLoadUserList (page) {
      const form = Object.assign({}, this.form, page || {
        page: this.form.page + 1
      })
      this.form = form
      const userSet = this._userSet || new Set()
      getZXUserList(form).then(data => {
        if (!data.total) {
          this.$toast({
            message: '没有相关报备'
          })
          return
        }
        const userList = data.list.reduce((result, item) => {
          const id = item.username + ',' + item.phone // 标识
          console.log(id)
          if (!userSet.has(id)) {
            userSet.add(id)
            result.push({
              id: item.id,
              username: item.username,
              phone: item.phone
            })
          }
          return result
        }, [])
        this._userSet || (this._userSet = userSet)
        this.total = data.total
        this.currentFetchTotal += data.list.length
        form.page === 1 ? (this.userList = userList) : (this.userList = this.userList.concat(userList))
        const { page, row } = form
        if (this.total !== this.currentFetchTotal && (page * row < data.total) && this.userList.length < 20) {
          this.handleLoadUserList()
        }
        this.loading = false
        this.showPopup = true
      }).catch(err => {
        console.log(err)
      })
    },
    // 选择用户确认
    handleSelectedUserOk () {
      if (!this.selectedUserItem) {
        this.$toast({
          message: '请先选择客户'
        })
        return
      }
      this.showPopup = false
      const item = this.selectedUserItem
      this.form.phone = item.phone
      this.form.username = item.username
      this.handlePhoneChange(item.phone)
      this.selectedUserItem = ''
    },
    // 根据用户名查询
    handleSearchByUserName () {
      // this.showPopup = true
      this.total = 0
      this.currentFetchTotal = 0
      this.userList = []
      this._userSet = null
      this.item = {}
      this.handleLoadUserList({
        province: '',
        city: '',
        dot: '',
        dttime: '',
        userType: 5,
        phone: '',
        page: 1,
        row: 40
      })
    },
    handlePopstate (e) {
      // 图片预览的时候， 禁止左滑页面后退
      this.showPicGallary = false
    },
    // handleUserSelect (item) {
    //   this.form.phone = item.phone
    //   this.username = item.username
    //   this.handlePhoneChange(item.phone)
    // },
    handleQuerySearch (queryString, cb) {
      const list = this.userList
      const results = queryString ? list.filter(item => {
        return item.username.toLowerCase().indexOf(queryString.toLowerCase()) > -1
      }) : list
      cb(results)
    },
    handleQueryByUserName () {
      const username = this.username

      if (!this._userList || !username) return
      this._userList.every(item => {
        if (item.username === username) {
          console.log(item.phone)
          this.form.phone = item.phone
          this.handlePhoneChange(item.phone)
          return false
        }
        return true
      })
    },
    handleImgScale (src) {
      this.scaleItem = src
      if (src) {
        const img = new Image()
        img.src = src
        img.onload = () => {
          const winWidth = window.innerWidth
          const winHeight = window.innerHeight
          const wScale = img.width / winWidth
          const hScale = img.height / winHeight
          const offset = 20
          if (hScale < wScale) {
            this.img.height = winHeight - offset
            this.img.width = winWidth - (offset * img.width / img.height) + 'px'
          } else {
            this.img.width = winWidth - offset
            this.img.height = winHeight - (offset * img.height / img.width) + 'px'
          }
        }
      }
    },
    handleMaskTouchMove (e) {
      console.log(e.cancelable)
      if (typeof event.cancelable !== 'boolean' || event.cancelable) {
        event.preventDefault()
      }
      // e.preventDefault()
    },
    formatDate (date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    handleLogout () {
      localStorage.removeItem('region')
      localStorage.removeItem('phone')
      this.$router.push({ name: 'loginMb' })
    },
    // 日期选择确认
    handleDatePickerConfirm (date) {
      console.log(date)
      this.form.dttime = this.formatDate(date)
      this.showDatePicker = false
    },
    // 获取图片证明
    handleGetContactimgList (id) {
      console.log('id=====')
      console.log(id)
      let temp = []
      getPicList({
        findex: 'contract',
        bindId: id
      }).then((data) => {
        // this.contractimgList = data && data.map(({ url }) => {
        //   return url
        // })
        if (data) {
          temp = [...temp, ...data.map(({ url }) => {
            return url
          })]
          this.contractimgList = temp
        }
      }).catch(err => {
        console.log(err)
      })
      getPicList({
        findex: 'certificater2',
        bindId: id
      }).then((data) => {
        if (data) {
          temp = [...temp, ...data.map(({ url }) => {
            return url
          })]
          this.contractimgList = temp
        }
      }).catch(err => {
        console.log(err)
      })
      getPicList({
        findex: 'certificater3',
        bindId: id
      }).then((data) => {
        if (data) {
          temp = [...temp, ...data.map(({ url }) => {
            return url
          })]
          this.contractimgList = temp
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleMaskClick ({ currentTarget }) {
      if (currentTarget === this.$refs.mask) {
        this.handleHiddenPicGallary()
      }
    },
    handleShowPicGallary (list, index) {
      this.picGallaryList = list
      this.gallaryActiveItem = index
      // this.showMask = true
      this.showPicGallary = true
      // 滚动的Y距离
      // this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // document.body.classList.add('overflow-hidden')
    },
    handleHiddenPicGallary () {
      document.body.classList.remove('overflow-hidden')
      // window.scrollTo(0, this.scrollTop)
      this.showMask = false
      this.showPicGallary = false
    },
    search (form) {
      const tempForm = Object.assign({}, this.form, form, {
        row: 10000000
      })
      getZXUserList(tempForm).then(data => {
        // this.userList = data.list
        this.handleSearchAfter(data.list)
      }).catch(err => {
        console.log('查询失败' + err.message)
      })
    },
    getPhoneList () {
      getZXUserList(this.form).then(data => {
        const phoneSet = new Set()
        const userList = []
        const userNameMapPhone = {}
        data && data.forEach(({ phone, username }) => {
          phoneSet.add(phone)
          userList.push({
            phone,
            username
          })
          // userList.push(`${username}-${phone}`)
          userNameMapPhone[username] ? userNameMapPhone[username].add(phone) : (userNameMapPhone[username] = new Set([phone]))
        })
        this.getUserList(userNameMapPhone)
        // this.getUserPickerData(userNameMapPhone)
        // this.phoneList = [...phoneSet]
        this._userList = userList
      }).catch(err => {
        console.log('查询失败' + err.message)
      })
    },
    getUserList (userNameMapPhone) {
      if (!userNameMapPhone) {
        return
      }
      const userList = []
      Object.keys(userNameMapPhone).forEach(key => {
        [...userNameMapPhone[key]].map(phone => {
          userList.push({ username: key, phone })
        })
      })
      this.userList = userList
    },
    getUserPickerData (userNameMapPhone) {
      const columns = []
      console.log(userNameMapPhone)
      Object.keys(userNameMapPhone).forEach(key => {
        console.log([...userNameMapPhone[key]])
        columns.push({
          text: key,
          children: [...userNameMapPhone[key]].map(phone => {
            return { text: phone }
          })
        })
      })
      console.log(columns)
      this.userPickerColumns = columns
    },
    handleSearchAfter (list) {
      if (!list || list.length < 1) return
      const provinceSet = new Set()
      const provinceMapItems = {}
      const provinceMapCitySet = {}
      list.forEach(item => {
        const { province, city } = item
        provinceSet.add(province)
        if (Array.isArray(provinceMapItems[province])) {
          provinceMapItems[province].push(item)
        } else {
          provinceMapItems[province] = [item]
        }
        if (provinceMapCitySet[province]) {
          provinceMapCitySet[province].add(city)
        } else {
          provinceMapCitySet[province] = new Set([city])
        }
      })
      this.provinceList = [...provinceSet]
      this.provinceMapItems = provinceMapItems
      this.provinceMapCitySet = provinceMapCitySet
      console.log(provinceMapItems)
      console.log(provinceMapCitySet)
    },
    clearItem () {
      this.item = {}
      this.contractimgList = []
    },
    handlePhoneChange (val) {
      this.form.province = null
      this.form.provinceList = null
      this.form.city = null
      this.form.dot = null
      this.form.dttime = null
      this.citySet = null
      this.dttimeSet = null
      this.netdotSet = null
      this.clearItem()
      this.search({
        phone: val
      })
    },
    // 省份改变
    handleProvinceChange (val) {
      this.form.city = null
      this.form.dot = null
      this.form.dttime = null
      this.citySet = null
      this.dttimeSet = null
      this.netdotSet = null
      this.item = {}
      this.clearItem()
      if (this.provinceMapItems && this.provinceMapItems[val]) {
        const citySet = new Set()
        const cityMapItems = {}
        this.provinceMapItems[val].forEach(item => {
          const city = item.city
          citySet.add(city)
          if (cityMapItems[city]) {
            cityMapItems[city].push(item)
          } else {
            cityMapItems[city] = [item]
          }
        })
        console.log(citySet)
        this.citySet = citySet
        this.cityMapItems = cityMapItems
      }
    },
    // 城市改变
    handleCityChange (val) {
      this.form.dot = ''
      this.form.dttime = ''
      this.dttimeSet = null
      this.netdotSet = null
      this.clearItem()
      if (this.cityMapItems && this.cityMapItems[val]) {
        const dttimeSet = new Set()
        const dttimeMapItems = {}
        this.cityMapItems[val].forEach(item => {
          const dttime = item.dttime
          dttimeSet.add(dttime)
          if (dttimeMapItems[dttime]) {
            dttimeMapItems[dttime].push(item)
          } else {
            dttimeMapItems[dttime] = [item]
          }
        })
        console.log(dttimeSet)
        this.dttimeSet = dttimeSet
        this.dttimeMapItems = dttimeMapItems
      }
    },
    handleDttimeChange (val) {
      this.form.dot = ''
      this.netdotSet = null
      this.clearItem()
      if (this.dttimeMapItems && this.dttimeMapItems[val]) {
        const netdotSet = new Set()
        const netdotMapItems = {}
        this.dttimeMapItems[val].forEach(item => {
          const dot = item.dot
          netdotSet.add(dot)
          if (netdotMapItems[dot]) {
            netdotMapItems[dot].push(item)
          } else {
            netdotMapItems[dot] = [item]
          }
        })
        console.log(netdotSet)
        this.netdotSet = netdotSet
        this.netdotMapItems = netdotMapItems
      }
    },
    // 网点改变
    handleNetdotChange (val) {
      if (this.netdotMapItems && this.netdotMapItems[val]) {
        const item = this.netdotMapItems[val][0]
        this.item = item
        if (item) {
          this.getReportDetail(item.id)
        }
      }
    },
    getReportDetail (id) {
      getReportDetail({
        id
      }).then(data => {
        console.log(data)
        // 获取联系证明
        this.handleGetContactimgList(id)
        this.item = data
      }).catch(err => {
        this.$toast({
          message: err.message
        })
        console.log('失败' + err.message)
      })
    },
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style lang="less">
.el-autocomplete-suggestion__wrap.el-scrollbar__wrap {
  max-height: 200px;
  max-height: 50vh;
}
.img-scale-wrap {
  position: fixed;
  height: 100%;
  left: 0px;
  right: 0px;
  top: 0px;
  width: 100%;
  z-index: 100000;
  background-color: black;
  opacity: 1;
  .img {
    position: absolute;
    left: 50%;
    top: 50%;
    // top: 100px;
    // width: 90%;
    width: 95vh;
    height: 98vw;
    transform: translate(-50%, -50%) rotate(-90deg);
    // transform: translate(-50%, -50%);
    // z-index: 100000000;
  }
}
//element ui 表单控件样式
.box-item {
  height: 40px;
  line-height: 40px;
  .control {
    &.col-2 {
      .el-select {
        width: calc(50% - 5px);
        margin-right: 10px;
        &:last-child {
          margin-right: 0px;
        }
      }
    }
    &.large {
      .el-input {
        width: 5.866667rem;
      }
    }
    &.date {
      .el-input {
        width: 5.866667rem;
      }
    }
  }
  .el-select {
    vertical-align: top;
  }
  .el-input {
    vertical-align: top;
    &.is-disabled {
      .el-input__inner {
        // border-color: #fefefe;
        color: #000;
        background-color: #ffffff;
      }
    }
  }
}
.el-picker-panel {
  position: fixed !important;
  top: 0px !important;
  left:0px !important;
  margin: 0px auto;
  left: 50% !important;
  margin-left: -155px !important;
  &.el-date-picker {
    width: 310px;
  }
  .popper__arrow {
    display: none;
  }
}
.user-name-input {
  .el-input__inner:focus {
    border: 1px solid #DCDFE6;
  }
  &.el-input {
    width: calc(100% - 90px) !important;
  }
}
</style>
<style lang="less" scoped>
.mb-mode {
  &.index {
    width: 100%;
    .img-wrap {
      padding-top: 40px;
      width: 100%;
      img {
        width: 100%;
        vertical-align: top;
      }
    }
    .nav {
      position: fixed;
      width: 100%;
      text-align: right;
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      z-index: 500;
      background-color: #ffffff;
      // padding: 5px;
      .user-pic {
        padding-top: 11px;
        width: 16px;
        height: 16px;
        vertical-align: top;
        margin-right: 2px;
      }
      .user-name {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        color: #888;
        vertical-align: top;
      }
      .btn {
        // margin-right: 15px;
        margin-left: 5px;
        vertical-align: top;
        background-color: #ffffff;
        color: #888;
        padding: 0px 8px;
        text-decoration: underline;
      }
    }
    .bd {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px;
    }
    .box-item {
      height: 40px;
      line-height: 40px;
      margin-bottom: 10px;
      position: relative;
      .control-prepend {
        float: left;
      }
      .control {
        // width: 100%;
        margin-left: 89px;
      }
      .control-append {
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translateY(-50%);
        margin-top: -2px;
      }
      .icon {
        padding-top: 12.335px;
        width: 12px;
        height: 12px;
        vertical-align: top;
        margin-right: 10px;
      }
      .label {
        display: inline-block;
        vertical-align: top;
        width:67px;
        height: 40px;
        line-height: 40px;
        font-size:13px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
        &.width-auto {
          width: auto;
        }
      }
      .value {
        font-size:15px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
      }
      .el-select {
        vertical-align: top;
      }
    }
    .pic-display {
      position: relative;
      .list {
        height: 4.666667rem;
        .list__item {
          float: left;
          width: calc(50% - 10px);
          margin-right: 10px;
          height: 4.666667rem;
          border: 1px solid #f7f5f5;
          overflow: hidden;
          border-radius: 6px;
          .pic {
            vertical-align: top;
            width: 100%;
            height: 100%;
          }
          &:last-child {
            margin-right: 0px;
          }
        }
        &.scroll {
          overflow-y: hidden;
          overflow-x: auto;
          white-space: nowrap;
          height: 4.666667rem;
          &::-webkit-scrollbar {
            display: none;
          }
          .list__item {
            display: inline-block;
            vertical-align: top;
            float: none;
            width: 4.506667rem;
            height: 4.666667rem;
          }
        }
      }
      .side-bar-more {
        position: absolute;
        width: 20px;
        right: -1px;
        height: 100%;
        top: 0px;
        background: rgba(232, 232, 232, .4);
        background: rgba(245, 245, 245, .8);
        img {
          transform: translateY(-50%);
          position: absolute;
          top: 50%;
          left: 0px;
          width: 100%;
        }
      }
    }
    .video {
      width: 4.506667rem;
      height: 2.666667rem;
      border: 1px solid #f7f5f5;
      border-radius: 6px;
    }
    .pic-gallary {
      position: fixed;
      top: 4rem;
      width: 95%;
      height: 5.333333rem;
      z-index: 1000;
      left: 50%;
      display: none;
      transform: translateX(-50%);
      &.show {
        display: block;
      }
      .gallary-box {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .gallary-swipe {
        width: 100%;
        height: 7.333333rem;
        background-color: #ffffff;
      }
    }
  }
  .search-input {
    padding: 5px 15px;
    // padding-top: 50px;
  }
  .btn-group {
    margin-top: 300px;
    text-align: center;
  }
  .popup-hd {
    position: sticky;
    top: 0px;
    display: flex;
    box-sizing: border-box;
    padding: 5px 20px;
    justify-content: space-between;
    z-index: 200;
    background-color: #ffffff;
    width: 100%;
  }
  .user-list {
    .user-list__item {
      display: flex;
      align-items: center;
      padding: 5px 0px;
      height: 40px;
      font-size: 13px;
      color: #888;
      // justify-content: space-between;
      border-bottom: 1px solid #f1eded;
      &.active {
        // background-color: #888;
        color: #000000;
      }
    }
    .name, .phone {
      flex: 1;
      text-align: center;
    }
  }
}
</style>
