<template>
  <div class="zhixing">
    <div class="top">
      <input class="input" v-model="input" placeholder="请输入需要搜索的内容">
      <button class="btn-1">搜索</button>
      <button class="btn-2" @click="outerVisible=true">新增执行报备</button>
    </div>
    <div class="center">
      <div class="center-1">
        <div>报备时间</div>
        <div>客户名称</div>
        <div>联系方式</div>
        <div>投放城市</div>
        <div>投放网点</div>
        <div>投放日期</div>
        <div>投放数量</div>
        <div>印刷物流证明</div>
        <div>投放证明</div>
        <div>执行依据</div>
      </div>
      <div class="center-2">
        <ul v-for="item in list" :key="item.id">
          <li>
            <div>{{item.createTime}}</div>
            <div>{{item.username}}</div>
            <div>{{item.phone || '--'}}</div>
            <div>{{item.province}} {{item.city}}</div>
            <div>{{item.dot}}</div>
            <div>{{item.dttime}}</div>
            <div>{{item.number}}</div>
            <div><img :src="item.headpic" alt=""></div>
            <div><img :src="item.contractimg" alt=""></div>
            <div><img :src="item.executeimg" alt=""></div>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog :visible.sync="outerVisible">
      <div class="zhixing-1">
        <p class="p1">执行报备</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="客户名称" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入客户名称"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <div><span class="c-red">*</span>投放城市</div>
          <el-form-item prop="province">
            <el-select v-model="ruleForm.region" placeholder="地区  （必 填）" class="aj6" @change="handleRegionChange">
              <el-option v-for="(item, index) in regionList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <el-select v-model="ruleForm.province" placeholder="省份  （必 填）" class="aj6" @change="handleProvinceChange">
              <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <el-select v-model="ruleForm.city" placeholder="城市  （必 填）" class="aj6" @change="handleCityChange">
              <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投放网点" prop="dot">
            <el-input v-model="ruleForm.dot" placeholder="请输入投放网点"></el-input>
          </el-form-item>
          <div>
            <el-form-item label="投放日期" prop="dttime">
              <el-col :span="10">
                <el-date-picker type="date" placeholder="请选择投放日期" v-model="ruleForm.dttime" style="width: 85%;"></el-date-picker>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item label="投放数量" prop="number">
            <el-input v-model="ruleForm.number" placeholder="请输入投放数量"></el-input>
          </el-form-item>
          <div class="dhv clearfix">
            <div class="hjdiv clearfix">印刷物流证明</div>
          </div>
          <div class="hbdfbvdf">
            <el-upload
              class="avatar-uploader"
              :action="actions.uploadHeadPotrait + '&bindId=' + userid"
              :show-file-list="false"
              :on-success="handleAvatarSuccess1"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="sdivb clearfix">投放证明</div>
          <div class="drvdfvb clearfix">1、执行依据（图片）</div>
          <div class="hbdfbvdf">
            <el-upload
              class="avatar-uploader"
              :action="actions.uploadHeadPotrait3 + '&bindId=' + userid"
              :show-file-list="false"
              :on-success="handleAvatarSuccess2"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-upload
              class="avatar-uploader"
              :action="actions.uploadHeadPotrait3 + '&bindId=' + userid"
              :show-file-list="false"
              :on-success="handleAvatarSuccess7"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl7" :src="imageUrl7" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-upload
              class="avatar-uploader"
              :action="actions.uploadHeadPotrait3 + '&bindId=' + userid"
              :show-file-list="false"
              :on-success="handleAvatarSuccess8"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl8" :src="imageUrl8" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="drvdfvb clearfix">2、执行依据 （视频）</div>
          <div class="hbdfbvdf">
            <el-upload
              class="avatar-uploader"
              :action="actions.uploadHeadPotrait4 + '&bindId=' + userid"
              :show-file-list="false"
              :on-success="handleAvatarSuccess3"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-upload
              class="avatar-uploader"
              :action="actions.uploadHeadPotrait4 + '&bindId=' + userid"
              :show-file-list="false"
              :on-success="handleAvatarSuccess4"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl4" :src="imageUrl4" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-upload
              class="avatar-uploader"
              :action="actions.uploadHeadPotrait4 + '&bindId=' + userid"
              :show-file-list="false"
              :on-success="handleAvatarSuccess5"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl5" :src="imageUrl5" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
        <el-dialog
          title=""
          :visible.sync="centerDialogVisible"
          width="50%"
          append-to-body>
          <div class="dbsiv">提交成功</div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="centerDialogVisible1">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import actions from '../../config/ima'
import { getRegionList, getProvinceListFromRegionName, getCityListFromProvinceName, getAreaListFromCityName } from '@/components/uitl/jsAddress.js'
import { getUserInf } from '@/utils/userInf'
import { getProvinceMap, getCityMap, getRegionMap } from '@/components/uitl/china-location'

export default {
  data () {
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
    return {
      regionList: getRegionList(),
      provinceList: null,
      cityList: null,
      actions,
      imageUrl1: '',
      userid: '',
      formatTime: '',
      list: '',
      provinceMap: getProvinceMap(), // 省份
      cityMap: null, // 城市
      centerDialogVisible: false,
      outerVisible: false,
      imageUrl2: '',
      imageUrl3: '',
      imageUrl4: '',
      imageUrl5: '',
      imageUrl6: '',
      imageUrl7: '',
      imageUrl8: '',
      ruleForm: {
        username: '',
        city: '',
        dttime: '',
        number: '',
        // dttime1: '',
        province: '',
        dot: '',
        phone: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入投放数量', trigger: 'blur' }
        ],
        dttime: [
          { required: true, message: '请输入投放日期', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入投放城市', trigger: 'blur' }
        ],
        dot: [
          { required: true, message: '请输入投放网点', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.id()
    this.getList()
  },
  methods: {
    handleRegionChange (regionName) {
      console.log(regionName)
      this.ruleForm.province = ''
      this.ruleForm.city = ''
      this.ruleForm.area = ''
      this.provinceList = getProvinceListFromRegionName(regionName)
      console.log(getProvinceListFromRegionName(regionName))
    },
    getList () {
      const region = getUserInf().region
      this.$axios({
        method: 'get',
        url: 'temp/admin/user/list',
        // url: 'admin/user/list',
        params: {
          userType: 3,
          region: region,
          page: 1,
          row: 10
        }
      }).then(data => {
        console.log('这是执行报备数据')
        console.log(data)
        this.list = data.data.data.list
        console.log(this.list)
      })
    },
    handleAvatarSuccess1 (res, file) {
      this.imageUrl1 = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess2 (res, file) {
      this.imageUrl2 = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess3 (res, file) {
      this.imageUrl3 = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess4 (res, file) {
      this.imageUrl4 = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess5 (res, file) {
      this.imageUrl5 = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess6 (res, file) {
      this.imageUrl6 = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess7 (res, file) {
      this.imageUrl7 = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess8 (res, file) {
      this.imageUrl8 = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    id () {
      this.$axios({
        method: 'get',
        url: 'temp/admin/user/creatId',
        // url: 'admin/user/creatId',
        data: {}
      }).then(data => {
        console.log('=============')
        console.log(data)
        this.userid = data.data.data
        console.log(this.userid)
      })
    },
    submitForm (formName) {
      const dttime = this.ruleForm.dttime
      console.log(dttime)
      const formatTime = dttime.getFullYear() + ':' + (dttime.getMonth() + 1) + ':' + dttime.getDate()
      this.$refs[formName].validate((valid) => {
        const region = getUserInf().region
        if (valid) {
          this.$axios({
            method: 'get',
            url: 'temp/admin/user/register',
            // url: 'admin/user/register',
            params: {
              username: this.ruleForm.username,
              city: this.ruleForm.city,
              dot: this.ruleForm.dot,
              dttime: formatTime,
              phone: this.ruleForm.phone,
              region: region,
              number: this.ruleForm.number,
              state: 0,
              userType: 3,
              id: this.userid
            }
          }).then(data => {
            console.log('成功')
            this.centerDialogVisible = true
            this.ruleForm = ''
            this.getList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    centerDialogVisible1 () {
      this.centerDialogVisible = false
      this.outerVisible = false
      this.ruleForm = ''
    },
    // 处理省份改变
    handleProvinceChange (provinceName) {
      this.ruleForm.city = null
      this.ruleForm.area = null
      this.cityList = getCityListFromProvinceName(provinceName)
    },
    // 处理城市改变
    handleCityChange (cityName) {
      this.ruleForm.area = ''
      this.areaList = getAreaListFromCityName(cityName)
      console.log('小地球')
      console.log(this.areaList)
    },
    // 处理城市选择
    handleCitySelect () {
      if (this.ruleForm.province) {
        console.log(this.ruleForm.province)
        this.cityMap = getCityMap(this.ruleForm.province)
      }
    },
    // 处理地区选择
    handleAreaSelect () {
      if (this.ruleForm.city) {
        this.areaMap = getRegionMap(this.ruleForm.city)
      }
    }

  }
}
</script>

<style lang="less">
.el-select {
  width:30%;
}
.clearfix:after,
.clearfix:before{
  content: "";
  display: table;
  }
  .clearfix:after{
    clear: both;
    }
    .clearfix{
      *zoom: 1;
      }
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  float: left;
}
.zhixing-1 {
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }
  .submit-btn {
    &.el-button--primary {
      width:370px;
      height:60px;
      background:rgba(229,1,19,1);
      border-radius:32px;
      margin-bottom: 40px;
    }
  }
}
</style>

<style lang="less" scoped>
.dialog-footer {
  margin-bottom: 40px;
}
.hbdfbvdf {
  width: 100%;
  height: 180px;
}
.p1 {
  text-align: center;
}
.dhv {
  height: 40px;
}
.zhixing {
  width: 100%;
  padding: 70px 10px;
  box-sizing: border-box;
  min-height: 100%;
  // height: 100%;
  background-color: #fff;
  // margin: 0 auto;
  .zhixing-1 {
    width: 470px;
    // text-align: center;
    height: 100%;
    margin: 0 auto;
    padding-top: 30px;
    p{
      font-size:30px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:42px;
      margin-bottom: 40px;
    }
    .hjdiv {
      font-size:18px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(68,65,65,1);
      line-height:18px;
      margin-bottom: 10px;
      margin-top: 10px;
    }
    .sdivb {
      font-size:18px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(68,65,65,1);
      line-height:25px;
      margin: 20px 0;
    }
    .drvdfvb {
      // display: block;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(135,136,137,1);
      line-height:20px;
      margin-bottom: 15px;
    }
  }
}

.top {
  // width: 100%;
  // margin: 0 auto;
  input {
    float: left;
    padding: 0 15px;
    box-sizing: border-box;
    width:468px;
    height:53px;
    border-radius:10px 0 0 10px;
    border:1px solid rgba(203,204,205,1);
    border-right: none;
  }
  .btn-1 {
    float: left;
    padding: 0;
    width: 80px;
    height:53px;
    border:1px solid rgba(203,204,205,1);
    border-left: none;
    border-radius: 0 10px 10px 0;
    text-align: center;
    line-height: 51px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-size: 18px;
    color: #fff;
    background-color: rgb(160, 163, 163);
    margin-right: 20px;
    cursor:pointer;
  }
  .btn-2 {
    width:166px;
    height:53px;
    border-radius:10px;
    border:1px solid rgba(179,179,179,1);
    background-color: #fff;
    font-size:18px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    cursor:pointer;
  }
}
.center {
  margin-top: 30px;
  .center-1 {
    width:100%;
    height:50px;
    border-radius:10px;
    padding: 0 30px;
    box-sizing: border-box;
    border:1px solid rgba(216,216,216,1);
    display: flex;
    div {
      flex: 1;
      line-height: 50px;
      text-align: center;
      height:25px;
      font-size:18px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
    }
  }
  .center-2 {
    width: 100%;
    // height:579px;
    border-radius:10px;
    border:1px solid rgba(216,216,216,1);
    margin-top: 10px;
    padding: 0 30px;
    box-sizing: border-box;
    ul {
      margin: 0;
      padding: 0;
      li {
        width: 100%;
        height: 63px;
        display: flex;
        text-align: center;
        div {
          height: 63px;
          flex: 1;
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(95,95,95,1);
          line-height: 63px;
          border-bottom: 1px solid rgba(216,216,216,1);;
          img {
            width:120px;
            height:63px;
            // margin: 20px auto;
          }
        }
      }
    }
  }
}
</style>
