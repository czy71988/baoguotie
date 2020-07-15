<template>
  <el-dialog :visible.sync="showDialog" width="6rem">
    <div class="dialog-bd">
      <p class="title">业务报备</p>
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
            <el-option label="三通一达" value="三通一达"></el-option>
            <el-option label="代理公司" value="代理公司"></el-option>
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
      }
    }
  },
  methods: {
    // 提交
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('input', false)
          this.$emit('submitOk', { ruleForm: this.ruleForm, uploadedFiles: this.uploadedFiles })
        }
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
        this.loading = true
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
      this.loading = false
      this.$message({
        type: 'error',
        message: '上传失败，请重新上传',
        duration: 900
      })
    },
    handleUploadSuccess (type, res, file) {
      this.ruleForm.contractimg = URL.createObjectURL(file.raw)
      this.loading = false
      this.uploadedFiles[type] = file
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
