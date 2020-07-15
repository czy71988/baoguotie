<template>
  <div class="kehu">
    <div class="top">
      <input class="searchVal" v-model="searchForm.username" placeholder="请输入要搜索的客户名称">
      <button class="btn-1" @click="handleSearch">搜索</button>
      <button class="btn reset-btn" @click="handleResetSearch">重置</button>
      <button class="btn common-btn export-btn" @click="handleExport" v-if="$user.getRegion() === 'null'">导出</button>
      <button class="btn-2" @click="handleAddReport">新增直客报备</button>
      <button class="btn common-btn" style="margin-left: 15px" @click="$router.push({ name: 'zhikeReportBatchAdd' })">批量新增直客报备</button>
      <!-- <router-link class="btn common-btn" :to="{ name: 'zhikeReportBatchAdd' }" >批量</router-link> -->
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
          label="客户名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系方式"
          align="center">
        </el-table-column>
        <el-table-column
          prop="ctprice"
          label="客户价格"
          align="center">
        </el-table-column>
        <el-table-column
          prop="ctsource"
          label="客户来源"
          align="center">
        </el-table-column>
        <el-table-column
          label="投放城市"
          align="center">
          <template slot-scope="scope">
            {{scope.row.province}} {{scope.row.city}}
          </template>
        </el-table-column>
        <el-table-column
          prop="dot"
          label="投放网点"
          align="center">
        </el-table-column>
        <el-table-column
          label="投放周期"
          align="center">
          <template slot-scope="scope">
            {{scope.row.startTime}}到{{scope.row.endTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="投放数量"
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
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleOpenEditReportDialog(scope.row)">编辑</el-button>
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
      <div class="kehu-1">
        <p>直客报备</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="客户名称" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入客户名称"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号" v-pure-number></el-input>
          </el-form-item>
          <el-form-item label="客户价格" prop="ctprice">
            <el-input v-model="ruleForm.ctprice" @input="hanldeFormatNumberWithFocus" placeholder="请输入客户价格，保留小数点后两位" @blur="handleFormatNumberAfterBlur"></el-input>
          </el-form-item>
          <el-form-item label="客户来源" prop="ctsource" class="custom-from-item">
            <!-- <el-input v-model="ruleForm.ctsource" placeholdetngr="请输入客户来源"></el-input> -->
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
          <!-- <el-form-item label="投放城市" prop="city">
            <el-input v-model="ruleForm.city" placeholder="投放城市"></el-input>
          </el-form-item> -->
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
          <!-- <el-form-item label="合约金额" prop="price">
            <el-input v-model="ruleForm.price" placeholder="请输入合约金额" @input="handleFormateToNumber" @blur="e => {ruleForm.price = ruleForm.price.endsWith('.') ? ruleForm.price.replace('.', '') : ruleForm.price}"></el-input>
          </el-form-item> -->
          <div style="text-align:left;margin-bottom: 10px"><span class="c-red">*</span>合同影印件</div>
          <el-form-item>
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
          </el-form-item>
          <el-form-item>
            <el-button class="submit-btn" type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProvinceMap, getCityMap, getRegionMap } from '@/components/uitl/china-location'
import { getRegionList, getProvinceListFromRegionName, getCityListFromProvinceName } from '@/components/uitl/jsAddress.js'
import { createUserId, getUserList, addReport, updateReport, exportReports, deletePic, getPicList } from '@/api'
import actions from '../../config/ima'
import { getUserInf } from '@/utils/userInf'
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
        // callback(Date.parse(startTime) > Date.parse(endTime) ? new Error('投放结束日期不能早于开始日期') : '')
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
      searchVal: '',
      actions,
      list: [],
      input: '',
      userid: '',
      provinceMap: getProvinceMap(), // 省份
      cityMap: null, // 城市
      centerDialogVisible: false,
      showReportDialog: false,
      ruleForm: {
        contractimg: '',
        username: '',
        area: '',
        province: '',
        city: '',
        dot: '',
        // price: '',
        // contract: '',
        ctprice: '', // 客户价格
        ctsource: '', // 客户来源
        startTime: null,
        endTime: null,
        number: '',
        phone: ''
      },
      willUploadContractImgIds: [],
      isUpdateReportState: false,
      oldReportInf: { // 旧的报备信息，用于报备编辑后前后对比，将修改的信息进行提交
      },
      oldUploadedImgs: { // 早已上传到服务的图片
        contractimg: []
      },
      newUploadedImgs: { // 最新的图片已经上传到服务器
        contractimg: []
      },
      loading: false,
      searchForm: {
        userType: 4,
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
        ],
        lanchCycle: [
          { required: true, validator: checkLanchCycle }
        ]
      }
    }
  },
  watch: {
    showReportDialog (val) {
      // 修改报备状态，就根据根据大区查找省份,根据省份查找城市
      if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate()
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
        this.submitSuccess = false
      }
    }
  },
  mounted () {
    // this.id()
    this.getList()
  },
  methods: {
    // 预览图片
    handlePreviewPic (type, index, row) {
      this.handleGetPicList(type, row, imgs => {
        this.list[index].contractimg = imgs.map(item => {
          return item.url
        })
      })
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
    // 新增报备
    handleAddReport () {
      this.isUpdateReportState = false
      this.id()
      this.showReportDialog = true
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
    // 清楚报备弹窗里字段数据
    clearReportDialogFields () {
      if (this.$refs.ruleForm) {
        this.resetRuleForm()
        this.$refs.ruleForm.resetFields()
      }
      this.clearNewUploadedImgs()
      this.oldUploadedImgs = Object.keys(this.oldUploadedImgs).reduce((result, key) => {
        result[key] = []
        console.log(key)
        return result
      }, {})
    },
    // 移除上传的文件 处理添加报备 data上传返回的字段
    doAddReportForUploadRemove (type, file) {
      file.status = 'delete'
      if (file.id) this.deletePic(file.id)
    },
    // 打开编辑报备弹窗
    handleOpenEditReportDialog (row) {
      this.clearReportDialogFields()
      this.isUpdateReportState = true
      this.oldReportInf = row // 存一份原报备数据信息
      // 拷贝一份报备数据，用于展现和修改
      this.ruleForm = Object.keys(this.ruleForm).reduce((result, key) => {
        result[key] = row[key]
        return result
      }, {})
      this.userid = row.id
      this.handleGetPicList('contract', row, imgs => {
        console.log(imgs)
        this.oldUploadedImgs['contractimg'] = imgs
      })
      this.showReportDialog = true
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
      this.handleDeletePicsAfterUpdateSuccess()
      if (Object.keys(updatedReportInf).length < 1) {
        this.$message({ message: '修改成功', type: 'success', duration: 900 })
        this.submitSuccess = true
        this.showReportDialog = false
        this.getList()
        return
      }
      updatedReportInf.id = oldReportInf.id
      console.group('被修改报备信息')
      console.log(updatedReportInf)
      console.groupEnd()
      updateReport(updatedReportInf).then(data => {
        this.submitSuccess = true
        this.$message({ message: '修改成功', type: 'success', duration: 900 })
        this.getList()
        this.showReportDialog = false
      }).catch(err => {
        this.$message({ message: err.message, type: 'error', duration: 900 })
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
    // 页码改变
    handlePageNumChange (val) {
      this.searchForm.page = val
      this.handleSearch()
    },
    // 搜索
    handleSearch () {
      this.getList()
    },
    // 重置搜索
    handleResetSearch () {
      this.searchForm = Object.assign({}, this.searchForm, this.page, { username: '' })
      this.getList()
    },
    hanldeFormatNumberWithFocus (val) {
      const num = val.match(/^\d+(\.?\d{0,2})/)
      this.ruleForm.ctprice = num && num[0]
    },
    handleFormatNumberAfterBlur () {
      const price = this.ruleForm.ctprice
      this.ruleForm.ctprice = price && price.endsWith('.') ? price.replace('.', '') : price
    },
    handleFormateToNumber (val) {
      const num = val.match(/^\d+(\.?\d{0,2})/)
      this.ruleForm.price = num && num[0]
    },
    handleUploadRemove (type, file) {
      if (this.isUpdateReportState) {
        file.status = 'remove'
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
      this.$message({
        typ: 'error',
        message: '上传失败,请重新上传',
        duration: 900
      })
      return false
    },
    getList () {
      getUserList(this.searchForm).then(data => {
        console.log('这是直客报备数据')
        console.log(data)
        this.list = data.list
        this.totalPages = data.total
        console.log(this.list)
      }).catch(err => {
        console.log('执客报备用户列表：' + err.message)
      })
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
        const region = getUserInf().region
        if (valid) {
          // alert('submit!')
          if (this.isUpdateReportState) {
            this.handleUpdateReport()
            return
          }
          const form = Object.assign({
            state: 0,
            userType: 4,
            id: this.userid,
            region
          }, this.ruleForm)
          // 图片不提交
          delete form.contractimg
          addReport(form).then(data => {
            this.$message({ message: '提交成功', type: 'success', duration: 900 })
            this.showReportDialog = false
            this.submitSuccess = true
            this.getList()
            this.newUserId = null
            this.clearReportDialogFields()
          }).catch(err => {
            this.$message({ message: err.message, type: 'error', duration: 900 })
          })
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
      return ruleForm
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    centerDialogVisible1 () {
      this.centerDialogVisible = false
      this.showReportDialog = false
      this.ruleForm = ''
    },
    handleUploadError () {
      this.loading = false
      this.$message({
        type: 'error',
        message: '上传失败，请重新上传',
        duration: 900
      })
    },
    handleUploadSuccess (type, { data }, file, fileList) {
      file.id = data.id
      if (this.isUpdateReportState) {
        this.newUploadedImgs.contractimg.push(file)
        console.log(this.newUploadedImgs)
        return
      }
      this.doAddReportAfterUploadSuccess(type, file)
    },
    // 上传成功 处理添加报备 data上传返回的字段
    doAddReportAfterUploadSuccess (type, file) {
      this.newUploadedImgs[type].push(file)
      // console.log(this.uploadedImgs[type])
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
.kehu-1 {
  .el-button--primary {
    width:370px;
    height:60px;
    background:rgba(229,1,19,1);
    border-radius:32px;
    // margin-top: 70px;
  }
  .el-image-viewer__img {
    min-width: 300px;
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
.kehu {
  padding: 70px 10px;
  padding-left: 5px;
  padding-top: 10px;
  padding-bottom: 50px;
  box-sizing: border-box;
}
.kehu {
  width: 100%;
  height: 100%;
  background-color: #fff;
  margin: 0 auto;
  .kehu-1 {
    width: 470px;
    text-align: center;
    margin: 0 auto;
    // padding-top: 120px;
    p{
      font-size:30px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:42px;
      margin-bottom: 70px;
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
  background-color: #ffffff;
  padding-bottom: 30px;
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
.submit-btn {
  margin-top: 15px;
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
