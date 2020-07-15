<template>
  <el-dialog :visible.sync="showDialog" width="6rem">
    <div class="dialog-bd">
      <p class="title">直客报备</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="客户名称" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号" v-pure-number></el-input>
        </el-form-item>
        <el-form-item label="客户价格" prop="ctprice">
          <el-input v-model="ruleForm.ctprice" @input="val => handleFormatNumberAfterInput('ctprice', val)" placeholder="请输入客户价格，保留小数点后两位" @blur="handleFormatNumberAfterBlur"></el-input>
        </el-form-item>
        <el-form-item label="客户来源" prop="ctsource" class="custom-from-item">
          <el-select v-model="ruleForm.ctsource" placeholder="请选择客户来源">
            <el-option label="中快总部" value="中快总部"></el-option>
            <el-option label="华东区域" value="华东区域"></el-option>
            <el-option label="华南区域" value="华南区域"></el-option>
            <el-option label="华中区域" value="华中区域"></el-option>
            <el-option label="华北区域" value="华北区域"></el-option>
            <el-option label="西南区域" value="西南区域"></el-option>
            <el-option label="西北区域" value="西北区域"></el-option>
            <el-option label="东北区域" value="东北区域"></el-option>
          </el-select>
        </el-form-item>
        <div class="jfbdv"><span class="c-red">*</span>投放城市</div>
        <el-form-item prop="city">
          <el-select v-model="ruleForm.area" placeholder="地区  （必 填）" class="aj6" @change="handleRegionChange">
            <el-option v-for="(item, index) in regionList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="ruleForm.province" placeholder="省份  （必 填）" class="aj6" @change="handleProvinceChange">
            <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="ruleForm.city" placeholder="城市  （必 填）" class="aj6">
            <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放网点" prop="dot">
          <el-input v-model="ruleForm.dot" placeholder="请输入投放网点"></el-input>
        </el-form-item>
          <el-form-item label="投放周期" prop="lanchCycle">
            <el-col :span="9">
              <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleForm.startTime" style="width: 83%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            </el-col>
            <el-col :span="9">
              <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleForm.endTime" style="width: 83%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            </el-col>
          </el-form-item>
        <el-form-item label="投放数量" prop="number">
          <el-input v-model="ruleForm.number" placeholder="投放数量" @input="val => ruleForm.number = val.match(/\d*/)[0]"></el-input>
        </el-form-item>
        <div style="text-align:left;margin-bottom: 10px"><span class="c-red">*</span>合同影印件</div>
        <el-form-item>
          <div class="clearfix multiple-upload-box multiple-uploader-box">
            <el-form-item>
                <el-upload
                  multiple
                  ref="contractimg"
                  :action="actions.uploadHeadPotrait3 + '&bindId=' + userid"
                  :file-list="oldUploadedFiles.contractimg"
                  :on-remove="file => handleUploadRemove('contractimg', file)"
                  :on-success="(res, file) => handleUploadSuccess('contractimg', res, file)"
                  accept="image/*"
                  :limit="10"
                  list-type="picture-card"
                  :before-upload="handleUploadBefore">
                  <i class="el-icon-plus append-word front-pic" ></i>
                </el-upload>
              </el-form-item>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="submit-btn" type="primary" @click="handleSubmit('ruleForm')">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import rules from '@/rules/zhikeRules'
import { getRegionList, getProvinceListFromRegionName, getCityListFromProvinceName } from '@/components/uitl/jsAddress.js'
import actions from '../../config/ima'
import { deletePic, getPicList } from '@/api/index'

export default {
  name: 'ZhikeReportBatchAddEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    ruleForm: {}
  },
  data () {
    // 检查投放周期 结束要不能早于开始， 结束和开始必填
    const checkLanchCycle = (rule, value, callback) => {
      const { startTime, endTime } = this.ruleForm
      if (startTime && endTime) {
        if (Date.parse(startTime) > Date.parse(endTime)) {
          callback(new Error('投放结束日期不能早于开始日期'))
        } else {
          callback()
        }
        return
      }
      if (!startTime && !endTime) {
        return callback(new Error('请选择投放周期'))
      }
      if (!startTime) {
        return callback(new Error('请选择投放开始日期'))
      }
      return callback(new Error('请选择投放结束日期'))
    }
    return {
      regionList: getRegionList(),
      provinceList: null,
      cityList: null,
      rules: {
        lanchCycle: [{ required: true, validator: checkLanchCycle }],
        ...rules
      },
      uploadedFiles: { // 已上传的文件对象
        contractimg: null
      },
      newUploadedFiles: { // 已上传的新文件集合，
        contractimg: []
      },
      oldUploadedFiles: { // 已上传的原有文件集合，
        contractimg: []
      },
      actions,
      showDialog: false,
      loading: false
    }
  },
  computed: {
    userid () {
      return this.ruleForm.id
    }
  },
  watch: {
    value (val) {
      this.showDialog = val
    },
    showDialog (val) {
      this.$emit('input', this.showDialog)
      if (val) {
        const { area, province } = this.ruleForm
        if (area) this.provinceList = getProvinceListFromRegionName(area)
        if (province) this.cityList = getCityListFromProvinceName(province)
        return
      }
      // 没有提交则，删除所上传的
      if (!this.submitSuccess) {
        this.deleteRemovedFiles(this.newUploadedFiles.contractimg)
      }
      // 关闭的，移除dialog上面所显示的文件， 并清空数据
      this.removeDisplayedFilesFromDialog()
    },
    'ruleForm.id' (val) {
      console.log(val)
      if (val) {
        this.getPicList('contract', val, fileList => {
          console.log(fileList)
          this.oldUploadedFiles.contractimg = fileList && fileList.map(file => {
            return {
              url: file.url,
              id: file.id,
              name: file.fileName,
              status: 'exist'
            }
          })
        })
      }
    }
  },
  methods: {
    getPicList (findex, id, cb) {
      getPicList({
        findex,
        bindId: id
      }).then(data => {
        if (typeof cb === 'function') cb(data)
      }).catch(err => {
        console.log('获取失败' + err.message)
      })
    },
    removeDisplayedFilesFromDialog () {
      const $refs = this.$refs
      Object.keys(this.newUploadedFiles).forEach(key => {
        if ($refs[key]) $refs[key].clearFiles()
        this.ruleForm[key] = ''
        this.newUploadedFiles[key] = []
      })
      Object.keys(this.oldUploadedFiles).forEach(key => {
        this.oldUploadedFiles[key] = []
      })
    },
    // 计算已上传的文件， 返回要已上传的文件，待删除的文件以
    calculateUploadedFiles (type) {
      const remainOldFiles = [] // 旧的保留的文件
      const willDeleteOldFiles = [] // 旧的需删除的文件
      const remainNewFiles = [] // 旧的保留的文件
      const willDeleteNewFiles = [] // 旧的需删除的文件
      console.log(this.newUploadedFiles)
      this.oldUploadedFiles[type] && this.oldUploadedFiles[type].forEach(file => {
        // const { id } = file.id
        if (file.status === 'remove') {
          willDeleteOldFiles.push(file)
        } else {
          remainOldFiles.push(file)
        }
      })
      this.newUploadedFiles[type] && this.newUploadedFiles[type].forEach(file => {
        // const { id } = file.id
        if (file.status === 'remove') {
          willDeleteNewFiles.push(file)
        } else {
          remainNewFiles.push(file)
        }
      })
      return {
        newUploadedFiles: {
          remain: remainNewFiles,
          remove: willDeleteNewFiles
        },
        oldUploadedFiles: {
          remain: remainOldFiles,
          remove: willDeleteOldFiles
        }
      }
    },
    // 提交
    handleSubmit () {
      const { newUploadedFiles, oldUploadedFiles } = this.calculateUploadedFiles('contractimg')
      if (newUploadedFiles.remain.length + oldUploadedFiles.remain.length < 1) {
        this.$message({
          type: 'error',
          message: '请上传合同影印件',
          duration: 900
        })
        return
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 删除所移除的文件
          this.deleteRemovedFiles([...newUploadedFiles.remove, ...oldUploadedFiles.remove], allDeletedSuccess => {
            if (allDeletedSuccess) {
              this.submitSuccess = true
              this.$emit('input', false)
              const contractimgs = [...newUploadedFiles.remain, ...oldUploadedFiles.remain]
              const form = Object.assign({}, this.ruleForm, {
                contractimg: contractimgs.map(file => file.url)
              })
              this.$emit('submitOk', { ruleForm: form, uploadedFiles: { contractimg: contractimgs } })
            }
          })
        }
      })
    },
    deleteRemovedFiles (files, delFinishedCb) {
      const sumLen = files.length
      let progressLen = 0
      let delSuccessLen = 0
      // 跟踪删除状况
      function followDelStatus () {
        // 全部删除成功通知已删除完成
        if (sumLen === progressLen) {
          if (typeof delFinishedCb === 'function') delFinishedCb(progressLen === delSuccessLen)
        }
      }
      followDelStatus()
      files.forEach(file => {
        deletePic(file.id).then(data => {
          progressLen++
          delSuccessLen++
          console.log('删除成功', file.id)
          followDelStatus()
        }).catch(err => {
          progressLen++
          console.log('删除失败', err.message)
          followDelStatus()
        })
      })
    },
    // 格式化为浮点类型数字，并保留两位数字
    handleFormatNumberAfterInput (type, val) {
      const num = val.match(/^\d+(\.?\d{0,2})/)
      this.ruleForm[type] = num && num[0]
    },
    handleFormatNumberAfterBlur () {
      const price = this.ruleForm.ctprice
      this.ruleForm.ctprice = price && price.endsWith('.') ? price.replace('.', '') : price
    },
    handleFormateToNumber (val) {
      const num = val.match(/^\d+(\.?\d{0,2})/)
      this.ruleForm.price = num && num[0]
    },
    // 上传
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
        // this.loading = true
        return
      }
      this.$message({
        typ: 'error',
        message: '上传失败,请重新上传',
        duration: 900
      })
      return false
    },
    handleUploadError () {
      // this.loading = false
      this.$message({
        type: 'error',
        message: '上传失败，请重新上传',
        duration: 900
      })
    },
    handleUploadRemove (type, file) {
      file.status = 'remove'
    },
    handleUploadSuccess (type, res, file) {
      // this.ruleForm.contractimg = URL.createObjectURL(file.raw)
      // this.loading = false
      // this.uploadedFiles[type] = file
      file.id = res.data.id
      this.newUploadedFiles[type].push(file)
    },
    handleRegionChange (regionName) {
      this.ruleForm.province = ''
      this.ruleForm.city = ''
      this.cityList = []
      this.provinceList = getProvinceListFromRegionName(regionName)
      console.log(getProvinceListFromRegionName(regionName))
    },
    // 处理省份改变
    handleProvinceChange (provinceName) {
      this.ruleForm.city = ''
      this.cityList = getCityListFromProvinceName(provinceName)
    }
  }
}
</script>
<style lang="less">
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
.dialog-bd {
  padding: 0px 60px;
  .title {
    text-align: center;
    font-size: 24px;
  }
  .uploader-icon {
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
}
</style>
