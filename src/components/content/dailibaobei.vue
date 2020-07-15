<template>
  <div class="daili">
    <div class="top">
      <input class="input" v-model="searchForm.username" placeholder="请输入要搜索的代理名称">
      <button class="btn-1" @click="handleSearch">搜索</button>
      <button class="btn reset-btn" @click="handleResetSearch">重置</button>
      <button class="btn common-btn export-btn" @click="handleExport" v-if="$user.getRegion() === 'null'">导出</button>
      <button class="btn-2" @click="handleAddReport">新增代理报备</button>
    </div>
    <div class="center">
      <el-table
        :data="list"
        border
        highlight
        fit
        style="width: 100%">
        <el-table-column
          fixed
          prop="username"
          label="代理公司"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系方式"
          align="center">
        </el-table-column>
        <el-table-column
          label="代理城市"
          align="center">
          <template slot-scope="scope">
            {{scope.row.province}} {{scope.row.city}}
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="代理价格"
          align="center">
        </el-table-column>
        <el-table-column
          prop="promisePrice"
          label="保证金"
          align="center">
        </el-table-column>
        <el-table-column
          prop="firstNeedPay"
          label="首笔预付款"
          align="center">
        </el-table-column>
        <el-table-column
          label="合同影印件"
          width="120"
          align="center">
          <template slot-scope="scope">
            <div class="title" v-if="!scope.row.contractimg"
              @click="handleLoadPicsForTableList({ findex: 'contract', fieldName: 'contractimg', belongsRow: scope.$index, id: scope.row.id })">
                点击查看图片
            </div>
            <el-image
              v-else
              @click="handlePreviewPic('contract', scope.$index, scope.row)"
              style="width: 120px; height: 63px"
              :src="Array.isArray(scope.row.contractimg) ? scope.row.contractimg[0] : scope.row.contractimg"
              :preview-src-list="Array.isArray(scope.row.contractimg) ? scope.row.contractimg : [scope.row.contractimg]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="报备时间">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleOpenEditDialog(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="handlePageNumChange"
        :current-page="searchForm.page"
        :page-size="searchForm.row"
        background
        layout="total, prev, pager, next, jumper"
        :total="totalPages">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="showReportDialog">
      <div class="daili-1">
        <p>代理报备</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="代理公司" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入代理公司名称"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号" v-pure-number></el-input>
          </el-form-item>
          <div><span class="c-red">*</span>代理城市</div>
          <el-form-item prop="city">
            <el-select v-model="ruleForm.area" placeholder="地区  （必 填）" class="aj6" @change="handleRegionChange">
              <el-option v-for="(item, index) in regionList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <el-select v-model="ruleForm.province" placeholder="省份  （必 填）" class="aj6" @change="handleProvinceChange">
              <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <el-select v-model="ruleForm.city"  placeholder="城市  （必 填）" class="aj6">
              <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代理价格" prop="price">
            <el-input v-model="ruleForm.price" placeholder="请输入代理价格，保留小数点后两位" @input="val => hanldeFormatNumberWithInput(val, 'price')" @blur="handleFormatNumberAfterBlur"></el-input>
          </el-form-item>
          <el-form-item label="保证金" prop="promisePrice">
            <el-input v-model="ruleForm.promisePrice" placeholder="请输入保证金" v-pure-number></el-input>
          </el-form-item>
          <el-form-item label="首笔预付款" prop="firstNeedPay">
            <el-input v-model="ruleForm.firstNeedPay" placeholder="请输入首笔预付款" v-pure-number></el-input>
          </el-form-item>
            <div><span class="c-red">*</span> 合同影印件</div>
            <div class="clearfix knjsovosv multiple-upload-box multiple-uploader-box">
              <el-form-item>
                <el-upload
                  multiple
                  ref="contractimgUploader"
                  :action="actions.uploadHeadPotrait3 + '&bindId=' + userid"
                  :on-success="(res, file, fileList) => handleUploadSuccess('contractimg', res, file, fileList)"
                  :on-remove="file => handleUploadRemove('contractimg', file)"
                  accept="image/*"
                  :limit="10"
                  :file-list="oldUploadedImgs.contractimg"
                  list-type="picture-card"
                  :before-upload="handleUploadBefore">
                  <i class="el-icon-plus append-word front-pic" ></i>
                </el-upload>
              </el-form-item>
            </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRegionList, getProvinceListFromRegionName, getCityListFromProvinceName } from '@/components/uitl/jsAddress.js'
import actions from '../../config/ima'
import { getUserInf } from '@/utils/userInf'
import { createUserId, getUserList, addReport, updateReport, exportReports, deletePic, getPicList } from '@/api'
console.log('getUserInf().region')
console.log(getUserInf().region)
export default {
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1\d{10}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      regionList: getRegionList(), // 大区列表
      provinceList: null, // 省份列表
      cityList: null, // 城市列表
      showReportDialog: false,
      actions,
      centerDialogVisible: false,
      list: [],
      userid: '',
      newUserId: '',
      searchVal: '',
      loading: false,
      isUpdateReportState: false, // 是否是修改状态
      ruleForm: {
        username: '',
        area: '', // 大区
        province: '',
        city: '',
        contractimg: '',
        price: '',
        phone: '',
        promisePrice: '',
        firstNeedPay: ''
      },
      uploadedImgs: { // 已经上传到服务器的的图片
        contractimg: []
      },
      oldUploadedImgs: { // 早已上传到服务的图片
        contractimg: []
      },
      newUploadedImgs: { // 最新的图片已经上传到服务器
        contractimg: []
      },
      willUploadContractImgIds: [], // 带修改的图片id
      oldReportInf: { // 旧的报备信息，用于报备编辑后前后对比，将修改的信息进行提交
      },
      searchForm: {
        userType: 1,
        username: '',
        region: getUserInf().region,
        row: 10,
        page: 1
      },
      totalPages: 0, // 总页数
      page: {
        row: 10,
        page: 1
      },
      rules: {
        username: [
          { required: true, message: '请输入代理公司名称', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择代理城市', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入代理价格', trigger: 'blur' }
        ],
        promisePrice: [
          { required: true, message: '请输入保证金', trigger: 'blur' }
        ],
        firstNeedPay: [
          { required: true, message: '请输入首笔预付款', trigger: 'blur' }
        ],
        contractimg: [
          { required: true, message: '请上传合同影印件', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // this.id()
    this.getList()
  },
  watch: {
    showReportDialog (val) {
      // 修改报备状态，就根据根据大区查找省份,根据省份查找城市
      if (this.isUpdateReportState && val) {
        this.provinceList = getProvinceListFromRegionName(this.ruleForm.area)
        this.cityList = getCityListFromProvinceName(this.ruleForm.province)
      }
      // 关闭时，若果是修改状态的话那就重置编辑框内的数据
      if (!val) {
        if (!this.submitSuccess) {
          this.restorePics()
        }
        if (this.isUpdateReportState) {
          this.isUpdateReportState = false
          this.clearReportDialogFields()
        } else {
          this.clearNewUploadedImgs()
        }
      }
    }
  },
  methods: {
    handlePreviewPic (type, index, row) {
      this.handleGetPicList(type, row, imgs => {
        this.list[index].contractimg = imgs.map(item => {
          return item.url
        })
      })
    },
    // 恢复图片
    restorePics () {
      console.log(this.newUploadedImgs.contractimg)
      this.newUploadedImgs.contractimg.forEach(item => {
        console.log('修改---删除')
        console.log(item.id)
        this.deletePic(item.id)
      })
    },
    deletePic (fileId) {
      deletePic(fileId).then(data => {
        console.log('删除成功')
      }).catch(Err => {
        console.log('删除成功')
      })
    },
    handleOpenEditDialog (row) {
      this.clearReportDialogFields()
      this.isUpdateReportState = true
      this.oldReportInf = row // 存一份原报备数据信息
      // 拷贝一份报备数据，用于展现和修改
      this.ruleForm = Object.keys(this.ruleForm).reduce((result, key) => {
        result[key] = row[key]
        return result
      }, {})
      this.userid = row.id
      this.showReportDialog = true
      this.handleGetPicList('contract', row, imgs => {
        console.log(imgs)
        this.oldUploadedImgs['contractimg'] = imgs
      })
    },
    handleGetPicList (findex, { id }, cb) {
      getPicList({
        findex,
        bindId: id
      }).then(data => {
        if (typeof cb === 'function') {
          const imgs = data && data.map(item => {
            return {
              url: item.url,
              id: item.id,
              name: item.fileName,
              status: 'exist'
            }
          })
          cb(imgs || [])
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 新增报备
    handleAddReport () {
      this.isUpdateReportState = false
      this.id()
      this.showReportDialog = true
    },
    handleLoadPicsForTableList ({ findex, belongsRow, fieldName, id }) {
      fieldName = fieldName || findex
      getPicList({
        findex,
        bindId: id
      }).then(data => {
        console.log(`加载成功findex:${findex}, 字段：${fieldName}, 行: ${belongsRow},id：${id}`)
        console.log(data)
        let temp = ''
        if (data && data.length > 0) {
          temp = data.map(file => file.url)
        }
        console.log(temp)
        this.list[belongsRow][fieldName] = temp
      }).catch(err => {
        // console.log('加载失败findex', findex, '字段：', fieldName, ''+ id)
        console.log(`加载失败findex:${findex}, 字段：${fieldName}, 行: ${belongsRow},id：${id},${err.message}`)
      })
    },
    // 请客新上传的
    clearNewUploadedImgs () {
      this.newUploadedImgs = Object.keys(this.newUploadedImgs).reduce((result, key) => {
        result[key] = []
        console.log(key)
        return result
      }, {})
      if (this.$refs.contractimgUploader) {
        this.$refs.contractimgUploader.clearFiles()
      }
    },
    // 清除报备弹窗里字段数据
    clearReportDialogFields () {
      if (this.$refs.ruleForm) {
        this.resetRuleForm()
        this.$refs.ruleForm.resetFields()
        this.$refs.contractimgUploader.clearFiles()
      }
      this.clearNewUploadedImgs()
      console.log(this.newUploadedImgs)
    },
    // 提交修改报备
    handleUpdateReport () {
      console.log(this.ruleForm)
      // 比对前后新旧报备数据信息，将被修改数据提交给后台修改
      const oldReportInf = this.oldReportInf
      const newReportInf = this.ruleForm
      const updatedReportInf = Object.keys(newReportInf).reduce((result, key) => {
        if (oldReportInf[key] !== newReportInf[key] && key !== 'contractimg') {
          result[key] = newReportInf[key]
        }
        return result
      }, {})
      console.log(oldReportInf.contractimg)
      console.log(newReportInf.contractimg)
      // if (this.ruleForm.contractimg !== this.oldReportInf.contractimg) {
      //   updatedReportInf.contractimg = this.ruleForm.contractimg
      // }
      this.handleDeletePicsAfterUpdateSuccess()
      if (Object.keys(updatedReportInf).length < 1) {
        this.$message({ message: '修改成功', type: 'success', duration: 900 })
        this.getList()
        this.submitSuccess = true
        this.showReportDialog = false
        return
      }
      updatedReportInf.id = oldReportInf.id
      console.group('被修改报备信息')
      console.log(updatedReportInf)
      console.groupEnd()
      updateReport(updatedReportInf).then(data => {
        this.submitSuccess = true
        this.getList()
        this.$message({ message: '修改成功', type: 'success', duration: 900 })
        this.showReportDialog = false
      }).catch(err => {
        this.$message({ message: err.message, type: 'error', duration: 900 })
      })
    },
    // 重置搜索
    handleResetSearch () {
      this.searchForm = Object.assign({}, this.searchForm, this.page, { username: '' })
      this.getList()
    },
    hanldeFormatNumberWithInput (val, fieldName) {
      const num = val.match(/^\d+(\.?\d{0,2})/)
      this.ruleForm[fieldName] = num && num[0]
    },
    handleFormatNumberAfterBlur () {
      const price = this.ruleForm.price
      this.ruleForm.price = price && price.endsWith('.') ? price.replace('.', '') : price
    },
    // 页码改变
    handlePageNumChange (val) {
      this.searchForm.page = val
      this.handleSearch()
    },
    handleSearch () {
      this.getList()
    },
    // 大区改变
    handleRegionChange (regionName) {
      this.ruleForm.province = ''
      this.ruleForm.city = ''
      this.provinceList = []
      this.cityList = []
      this.provinceList = getProvinceListFromRegionName(regionName)
    },
    // 处理省份改变
    handleProvinceChange (provinceName) {
      this.ruleForm.city = null
      this.cityList = null
      this.cityList = getCityListFromProvinceName(provinceName)
    },
    id () {
      // 创建报备id
      if (this.newUserId) {
        console.log('复用缓存id' + this.newUserId)
        this.userid = this.newUserId
        return
      }
      createUserId().then(data => {
        this.newUserId = data
        console.log('创建id' + data)
        this.userid = data
      }).catch(err => {
        console.log('创建报备id失败:' + err.message)
      })
    },
    getList () {
      getUserList(this.searchForm).then(data => {
        this.totalPages = data.total
        this.list = data.list
      }).catch(err => {
        console.log('获取代理报备列表失败:' + err.message)
      })
    },
    submitForm (ruleForm) {
      // 合同影印件为十张
      let contractimgLen = 0
      const newUploadedContractimg = this.newUploadedImgs.contractimg
      if (this.isUpdateReportState) {
        const oldUploadedContractimg = this.oldUploadedImgs.contractimg
        oldUploadedContractimg.forEach(item => {
          if (item.status !== 'remove') {
            contractimgLen++
          }
        })
      }
      newUploadedContractimg.forEach(item => {
        if (item.status === 'success') {
          contractimgLen++
        }
      })
      if (contractimgLen < 1) {
        this.$message({ message: '请上传合同影印件', type: 'error', duration: 900 })
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 是否是修改状态
          if (this.isUpdateReportState) {
            this.handleUpdateReport()
            return
          }
          // alert('submit!')
          const region = getUserInf().region
          const form = Object.assign({
            state: 0,
            userType: 1,
            region,
            id: this.userid
          }, this.ruleForm)
          // 有关图片字段信息不提交到后台
          delete form.contractimg
          addReport(form).then(data => {
            this.getList()
            this.showReportDialog = false
            this.submitSuccess = true
            this.$message({ message: '提交成功', type: 'success', duration: 900 })
            this.newUserId = null
            console.log('dailebao')
            this.clearReportDialogFields()
          }).catch(err => {
            console.log('注册代理报备失败:' + err.message)
          })
        }
      })
    },
    handleDeletePicsAfterUpdateSuccess () {
      const newUploadedContractimg = this.newUploadedImgs.contractimg
      const oldUploadedContractimg = this.oldUploadedImgs.contractimg
      newUploadedContractimg.forEach(item => {
        if (item.status === 'remove') {
          console.log('删除新的')
          this.deletePic(item.id)
        }
      })
      oldUploadedContractimg.forEach(item => {
        if (item.status === 'remove') {
          console.log('删除旧的的')
          this.deletePic(item.id)
        }
      })
    },
    // 重置所填写的信息
    resetRuleForm () {
      const ruleForm = Object.assign({}, this.ruleForm)
      for (const key in ruleForm) {
        ruleForm[key] = null
      }
      this.ruleForm = ruleForm
      this.cityList = null
      this.provinceList = null
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    centerDialogVisible1 () {
      this.centerDialogVisible = false
      this.showReportDialog = false
      this.ruleForm = ''
    },
    handleUploadRemove (type, file) {
      if (this.isUpdateReportState) {
        file.status = 'remove'
        // if (file.status === 'exist') {
        // }
        return
      }
      this.doAddReportForUploadRemove(type, file)
    },
    handleUploadBefore (file) {
      if (this.$fileController.imgSizeTooLarge(file)) {
        this.$message({
          type: 'error',
          message: `图片大小不能超过${this.$fileController.IMG_SIZE}mb`,
          duration: 900
        })
        return false
      }
      if (this.userid) {
        // 上传失败，显示上传中提示
        this.loading = true
        return
      }
      this.id()
      this.$message({
        type: 'error',
        message: '上传失败,请重新上传',
        duration: 900
      })
      return false
    },
    handleUploadSuccess (type, { data }, file, fileList) {
      console.log('=========upload success')
      console.log(data)
      console.log(data.url)
      console.log(file)
      console.log('end')
      file.id = data.id
      if (this.isUpdateReportState) {
        this.newUploadedImgs.contractimg.push(file)
        console.log(this.newUploadedImgs)
        return
      }
      // 添加报备
      this.doAddReportAfterUploadSuccess(type, file)
      // this.loading = false
    },
    // 移除上传的文件 处理添加报备 data上传返回的字段
    doAddReportForUploadRemove (type, file) {
      file.status = 'delete'
      this.deletePic(file.id)
    },
    // 上传成功 处理添加报备 data上传返回的字段
    doAddReportAfterUploadSuccess (type, file) {
      this.newUploadedImgs[type].push(file)
      // console.log(this.uploadedImgs[type])
    },
    handleUploadError () {
      this.loading = false
      this.$message({
        typ: 'error',
        message: '上传失败,请重新上传',
        duration: 900
      })
    },
    handleExport () {
      const form = Object.assign({}, this.searchForm)
      delete form.row
      delete form.page
      exportReports(form)
    }
  }
}
</script>

<style lang="less">
.el-form-item__content {
  text-align: center;
}
  .el-select {
    width: 30%;
  }
.avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}
.dialog-footer {
  text-align: center;
  line-height: 60px;
  margin: 0 auto;
}
.beivbibvsifv {
  width:370px;
  height:60px;
  background:rgba(229,1,19,1);
  border-radius:32px;
  // height:30px;
  font-size:22px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(255,255,255,1);
  line-height:60px;
  margin: 0 auto;
  margin-bottom: 30px;
}
.dbsiv {
  // width: 100%;
  text-align: center;
  margin: 0 auto;
  font-size:30px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  margin-top: 150px;
  margin-bottom: 250px;
}
.daili-1 {
  // background-color: aqua;
  padding: 50px 100px;
  box-sizing: border-box;
  p {
    font-size: 24px;
    text-align: center;
  }
  .el-button--primary {
    width:370px;
    height:60px;
    background:rgba(229,1,19,1);
    border-radius:32px;
    // margin: 0 auto;
    text-align: center;
  }

}
.el-upload {
  width: 130px;
  height: 130px;
}
@imgW: 80px;
.multiple-upload-box {
  margin-top: 5px;
  .el-form-item__content {
    text-align: left;
  }
  .el-upload--picture-card {
    width: @imgW;
    height: @imgW;
    line-height: @imgW;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: @imgW;
    height: @imgW;
    line-height: @imgW;
  }
}
</style>

<style lang="less" scoped>
  .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
  }
  .daili {
    // padding: 70px 70px;
    padding: 5px;
    padding-top: 10px;
    padding-bottom: 50px;
    width: 100%;
    min-height: 100%;
    background-color: #fff;
    margin: 0 auto;
    box-sizing: border-box;
    // .daili-1 {
    //   width: 470px;
    //   text-align: center;
    //   margin: 0 auto;
    //   padding-top: 120px;
    //   p{
    //     font-size:30px;
    //     font-family:PingFangSC-Medium,PingFang SC;
    //     font-weight:500;
    //     color:rgba(51,51,51,1);
    //     line-height:42px;
    //     margin-bottom: 70px;
    //   }
    // }
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
      .btn-1:active {
        background-color: aqua;
        border-radius: 0 10px 10px 0;
        color: red;
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
              border-bottom: 1px solid rgba(216,216,216,1);
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
  }
  .high-light {
    background: #f0f9eb;
  }
</style>
