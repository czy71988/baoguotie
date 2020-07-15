<template>
  <div class="zhixing">
    <div class="top">
      <input class="input" v-model="searchForm.username" placeholder="请输入要搜索的客户名称">
      <button class="btn-1" @click="handleSearch">搜索</button>
      <button class="btn reset-btn" @click="handleResetSearch">重置</button>
      <button class="btn common-btn export-btn" @click="handleExport" v-if="$user.getRegion() === 'null'">导出</button>
      <button class="btn-2" @click="handleAddReport">新增包裹贴报备</button>
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
          label="报备公司"
          align="center">
          <template slot-scope="scope">
            {{scope.row.region === 'null' ? '总部' : (scope.row.region || '--')}}
          </template>
        </el-table-column>
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
          prop="dttime"
          label="投放日期"
          align="center">
        </el-table-column>
        <el-table-column
          prop="number"
          label="投放数量"
          align="center">
        </el-table-column>
        <el-table-column
          label="印刷物流证明"
          width="120"
          align="center">
          <template slot-scope="scope">
            <div class="title" v-if="!scope.row.headpic"
              @click="getPringLogisticPics({ belongsRow: scope.$index, id: scope.row.id })">
                点击查看图片
            </div>
            <el-image
              v-else
              style="width: 120px; height: 63px"
              :src="scope.row.headpic"
              :preview-src-list="[scope.row.headpic, scope.row.headpic1]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="图片证明"
          width="120"
          align="center">
          <template slot-scope="scope">
            <div class="title" v-if="!scope.row.contractimg"
              @click="handleLoadPicsForTableList({ findex: 'contract', fieldName: 'contractimg', belongsRow: scope.$index, id: scope.row.id })">
                点击查看图片
            </div>
            <el-image
              v-else
              @click="handlePreviewCertificaterPic(scope.$index, scope.row)"
              style="width: 120px; height: 63px"
              :src="(scope.row.contractimg && Array.isArray(scope.row.contractimg)) ? scope.row.contractimg[0] : scope.row.contractimg"
              :preview-src-list="(scope.row.contractimg && Array.isArray(scope.row.contractimg)) ? scope.row.contractimg : [scope.row.contractimg]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="视频证明"
          width="120"
          align="center">
          <template slot-scope="scope">
            <div class="title" v-if="!scope.row.executeimg"
              @click="handleLoadPicsForTableList({ findex: 'execute', fieldName: 'executeimg', belongsRow: scope.$index, id: scope.row.id })">
                点击加载视频
            </div>
            <video
              v-else
              style="width: 120px; height: 63px"
              :src="scope.row.executeimg"
              controls>
            </video>
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
            <el-button type="text" size="small" @click="handleOpenEditReportDialog(scope.row, scope.$index)">编辑</el-button>
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
      <div class="zhixing-1">
        <p class="p1">包裹贴报备</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="客户名称" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入客户名称"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号" v-pure-number></el-input>
          </el-form-item>
          <div><span class="c-red">*</span>投放城市</div>
          <el-form-item prop="province">
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
          <div>
            <el-form-item label="投放日期" prop="dttime">
              <el-col :span="10">
                <el-date-picker type="date" placeholder="请选择投放日期" v-model="ruleForm.dttime" style="width: 85%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item label="投放数量" prop="number">
            <el-input v-model="ruleForm.number" v-pure-number placeholder="请输入投放数量"></el-input>
          </el-form-item>
          <!-- <el-form-item label="投放数量" prop="number">
            <el-input v-model="ruleForm.number" placeholder="请输入投放数量"></el-input>
          </el-form-item> -->
          <div class="dhv clearfix">
            <div class="hjdiv clearfix"><span class="c-red">*</span>印刷物流证明</div>
          </div>
          <el-form-item prop="printLogisticsPics">
            <div class="hbdfbvdf">
              <el-upload
                class="avatar-uploader"
                :action="actions.uploadHeadPotrait + '&bindId=' + userid"
                :show-file-list="false"
                accept="image/*"
                ref="print"
                :on-change="file => handleUploadChange('print', file)"
                :on-error="err => handleUplaodError('print', file)"
                :on-success="(res, file) => handleUploadSuccess('print', file, res)"
                :before-upload="(file) => handleUploadBefore('print', file)">
                <img v-if="uploadUrls.print" :src="uploadUrls.print" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon append-word yinshua"></i>
                <div class="loading" v-loading="loading.print" element-loading-text="拼命上传中"></div>
              </el-upload>
              <el-upload
                ref="logistics"
                class="avatar-uploader wuliu"
                :action="actions.uploadHeadPotrait1 + '&bindId=' + userid"
                :show-file-list="false"
                accept="image/*"
                :on-success="(res, file) => handleUploadSuccess('logistics', file, res)"
                :on-error="err => handleUplaodError('logistics', file)"
                :before-upload="file => handleUploadBefore('logistics', file)">
                <img v-if="uploadUrls.logistics" :src="uploadUrls.logistics" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon append-word wuliu"></i>
                <div class="loading" v-loading="loading.logistics" element-loading-text="拼命上传中"></div>
              </el-upload>
            </div>
          </el-form-item>
          <div class="sdivb clearfix">投放证明</div>
          <div class="drvdfvb clearfix"><span class="c-red">*</span>1、图片证明<span class="c-red" style="font-size:12px;margin-left:13px">(正面特写1-3张;正在粘贴3-10张;堆积排列3-10张)</span></div>
          <div class="hbdfbvdf action-box multiple-uploader-box">
            <!-- 1-3 -->
            <el-upload
              ref="certificater1"
              multiple
              :action="actions.uploadHeadPotrait3 + '&bindId=' + userid"
              :on-success="(res, file) => handleUploadSuccess('certificater1', file, res)"
              :on-remove="handleRemove"
              accept="image/*"
              :limit="3"
              :file-list="uploadedImgs.certificater1"
              list-type="picture-card"
              :before-upload="handleUploadCerticaterBefore">
              <i class="el-icon-plus append-word front-pic" ></i>
              <!-- <el-button class="" size="small" type="primary">点击上传</el-button> -->
            </el-upload>
          </div>
          <div class="hbdfbvdf action-box multiple-uploader-box">
            <!-- 3-10 -->
            <el-upload
              ref="certificater2"
              multiple
              :file-list="uploadedImgs.certificater2"
              :action="actions.uploadCertificater2 + '&bindId=' + userid"
              :on-success="(res, file) => handleUploadSuccess('certificater2', file, res)"
              :on-remove="handleRemove"
              accept="image/*"
              :limit="10"
              list-type="picture-card"
              :before-upload="handleUploadCerticaterBefore">
              <i class="el-icon-plus append-word copy-paste"></i>
              <!-- <el-button class="" size="small" type="primary">点击上传</el-button> -->
            </el-upload>
          </div>
          <div class="hbdfbvdf action-box multiple-uploader-box">
            <!-- 3-10 -->
            <el-upload
              multiple
              ref="certificater3"
              :file-list="uploadedImgs.certificater3"
              :action="actions.uploadCertificater3 + '&bindId=' + userid"
              :on-success="(res, file) => handleUploadSuccess('certificater3', file, res)"
              :on-remove="handleRemove"
              accept="image/*"
              :limit="10"
              list-type="picture-card"
              :before-upload="handleUploadCerticaterBefore">
              <i class="el-icon-plus append-word order"></i>
              <!-- <el-button class="" size="small" type="primary">点击上传</el-button> -->
            </el-upload>
          </div>
          <div class="drvdfvb clearfix"><span class="c-red">*</span>2、视频证明</div>
          <el-form-item prop="video">
            <div class="hbdfbvdf">
              <el-upload
                ref="video"
                class="avatar-uploader"
                accept="video/mp4,audio/mp4"
                :action="actions.uploadVideo + '&bindId=' + userid"
                :show-file-list="false"
                :on-success="(res, file) => handleUploadSuccess('video', file, res)"
                :on-error="err => handleUplaodError('video', file)"
                :before-upload="file => handleUploadBefore('video', file)">
                <!-- <img v-if="imageUrl3" :src="imageUrl3" class="avatar"> -->
                <video width="658" height="444" v-if="uploadUrls.video" :src="uploadUrls.video" class="video" controls="controls"></video>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="loading" v-loading="loading.video" element-loading-text="拼命上传中"></div>
              </el-upload>
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
import actions from '../../config/ima'
import { getRegionList, getProvinceListFromRegionName, getCityListFromProvinceName } from '@/components/uitl/jsAddress.js'
import { getUserInf } from '@/utils/userInf'
import { getProvinceMap, getCityMap, getRegionMap } from '@/components/uitl/china-location'
import { deletePic, getPicList, createUserId, getUserList, addReport, updateReport, exportReports, getReportDetail } from '@/api/index'

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
    const checkVideo = (rule, value, callback) => {
      if (this.uploadUrls.video) {
        return callback()
      }
      return callback(new Error('请上传视频证明'))
    }
    const checkPrintLogisticsPics = (rule, value, callback) => {
      const { print, logistics } = this.uploadUrls
      if (print && logistics) {
        return callback()
      }
      if (!print && !logistics) return callback(new Error('请上传印刷物流证明'))
      if (!print) return callback(new Error('请上传印刷证明'))
      return callback(new Error('请上传物流证明'))
    }
    return {
      regionList: getRegionList(),
      searchVal: '',
      provinceList: null,
      cityList: null,
      actions,
      imageUrl1: '',
      userid: '',
      formatTime: '',
      list: [],
      provinceMap: getProvinceMap(), // 省份
      cityMap: null, // 城市
      centerDialogVisible: false,
      showReportDialog: false,
      isSubmitStatus: false, // 是否是提交状态
      submitSuccess: false, // 是否提交成功
      uploadUrls: {
        logistics: '', // 印刷物流
        print: '', // 印刷物流
        video: '',
        certificater1: [],
        certificater2: [],
        certificater3: []
      },
      uploadedImgs: { // 已上传的，用户修改显示
        certificater1: [],
        certificater2: [],
        certificater3: []
      },
      newUploadedFiles: { // 上传的文件
        certificater1: [],
        certificater2: [],
        certificater3: [],
        logistics: [],
        print: [],
        video: []
      },
      loading: { // 用于上传图片是否显示上传中，动画效果
        logistics: false,
        print: false,
        video: false
      },
      searchForm: {
        userType: 3,
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
      ruleForm: {
        username: '',
        area: '',
        province: '',
        city: '',
        dttime: '',
        number: '',
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
        video: [
          { required: true, validator: checkVideo, trigger: 'blur' }
        ],
        printLogisticsPics: [
          { required: true, validator: checkPrintLogisticsPics, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
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
          // 添加和修改操作，移除未提交成功到已经所上传的文件
          this.removeUploadedFilesOfUnsubmit()
        }
        if (this.isUpdateReportState) {
          // 修改的没有提交成功，则删除掉
          if (!this.submitSuccess) {
            console.log(this.submitSuccess)
            this.restorePics()
          }
          // 不是提交触发的则，把上传的给删除掉
          this.clearReportDialogFields()
          this.isUpdateReportState = false
        }
        this.submitSuccess = false
      }
    }
  },
  methods: {
    handleAddReport () {
      // 创建id
      this.id()
      this.showReportDialog = true
    },
    // 清除报备弹窗里字段数据
    clearReportDialogFields () {
      if (this.$refs.ruleForm) {
        this.resetRuleForm()
        this.$refs.ruleForm.resetFields()
      }
      // this.removeUploadedFilesOfUnsubmit()
    },
    // 未提交移除所上传的文件，
    removeUploadedFilesOfUnsubmit () {
      const newUploadedFiles = this.newUploadedFiles
      const $refs = this.$refs
      Object.keys(newUploadedFiles).forEach(key => {
        console.log('正在移除文件:' + key)
        if ($refs[key]) $refs[key].clearFiles()
        newUploadedFiles[key].forEach(file => {
          console.log('正在移除文件:' + key, ',file:' + file.id)
          this.handleDeletePic(file.id)
        })
      })
      this.newUploadedFiles = {
        certificater1: [],
        certificater2: [],
        certificater3: [],
        logistics: [],
        print: [],
        video: []
      }
      this.uploadUrls.logistics = ''
      this.uploadUrls.print = ''
      this.uploadUrls.video = ''
    },
    restorePics () {
      // const oldReportInf = this.oldReportInf
      // const updatedReportInf = Object.assign({
      //   headpic: oldReportInf.headpic,
      //   headpic1: oldReportInf.headpic1,
      //   executeimg: oldReportInf.executeimg
      // })
      // console.log('restore')
      // updatedReportInf.id = oldReportInf.id
      // console.log(updatedReportInf)
      // updateReport(updatedReportInf).then(data => {
      //   this.getList()
      // }).catch(err => {
      //   this.$message({ message: err.message, type: 'error', duration: 900 })
      // })
    },
    // 打开编辑报备弹窗
    handleOpenEditReportDialog (row, index) {
      // 清空报备弹窗里原有的数据
      this.clearReportDialogFields()
      this.isUpdateReportState = true
      // 存一份原报备数据信息和拷贝一份报备数据，用于展现和修改
      // this.oldReportInf = row
      this.ruleForm = Object.keys(this.ruleForm).reduce((result, key) => {
        result[key] = row[key]
        return result
      }, {})
      const $refs = this.$refs
      Object.keys(this.newUploadedFiles).forEach(key => {
        if ($refs[key]) $refs[key].clearFiles()
        this.newUploadedFiles[key] = []
      })
      this.userid = row.id
      this.getReportDetail(row.id, data => {
        this.oldReportInf = data
        this.uploadUrls.print = data.headpic
        this.uploadUrls.logistics = data.headpic1
        this.uploadUrls.video = data.executeimg
      })
      this.getCertificaterPics(index, row)
      setTimeout(() => {
        this.showReportDialog = true
      }, 200)
    },
    getReportDetail (id, cb) {
      getReportDetail({
        id
      }).then(data => {
        console.log(data)
        if (typeof cb === 'function') {
          cb(data)
        }
      }).catch(err => {
        console.log('失败' + err.message)
      })
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
      if (Object.keys(updatedReportInf).length < 1) {
        this.$message({ message: '修改成功', type: 'success', duration: 900 })
        this.handleUpdateReportSuccess()
        this.submitSuccess = true
        this.showReportDialog = false
        return
      }
      updatedReportInf.id = oldReportInf.id
      console.group('被修改报备信息')
      console.log(updatedReportInf)
      console.groupEnd()
      updateReport(updatedReportInf).then(data => {
        this.$message({ message: '修改成功', type: 'success', duration: 900 })
        this.handleUpdateReportSuccess()
        this.getList()
        this.submitSuccess = true // 提交成功
        this.showReportDialog = false
      }).catch(err => {
        this.$message({ message: err.message, type: 'error', duration: 900 })
      })
    },
    handleUpdateReportSuccess () {
      // 删除图片
      const { certificater1, certificater2, certificater3 } = this.uploadedImgs
      console.log('删除图片')
      console.log(certificater1)
      console.log(certificater2)
      console.log(certificater3)
      certificater1.forEach(item => {
        if (item.status === 'delete') {
          this.handleDeletePic(item.id)
        }
      })
      certificater2.forEach(item => {
        if (item.status === 'delete') {
          this.handleDeletePic(item.id)
        }
      })
      certificater3.forEach(item => {
        if (item.status === 'delete') {
          this.handleDeletePic(item.id)
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
    // 获取投放证明图片
    getCertificaterPics (index, row) {
      // 正面特写 certificati 正在粘贴 堆积排列
      this.handleGetPicList('contract', index, row, imgs => {
        console.log('contract')
        console.log(imgs)
        this.uploadedImgs.certificater1 = imgs
      })
      this.handleGetPicList('certificater2', index, row, imgs => {
        console.log('certificater2')
        console.log(imgs)
        this.uploadedImgs.certificater2 = imgs
      })
      this.handleGetPicList('certificater3', index, row, imgs => {
        console.log('certificater3')
        console.log(imgs)
        this.uploadedImgs.certificater3 = imgs
      })
    },
    handlePreviewCertificaterPic (index, row) {
      // 正面特写 certificati 正在粘贴 堆积排列
      let temp = []
      this.handleGetPicList('contract', index, row, imgs => {
        console.log('contract')
        console.log(imgs)
        temp = [...temp, ...imgs.map(({ url }) => {
          return url
        })]
        this.list[index].contractimg = temp
      })
      this.handleGetPicList('certificater2', index, row, imgs => {
        console.log('certificater2')
        console.log(imgs)
        temp = [...temp, ...imgs.map(({ url }) => {
          return url
        })]
        this.list[index].contractimg = temp
      })
      this.handleGetPicList('certificater3', index, row, imgs => {
        console.log('certificater3')
        console.log(imgs)
        temp = [...temp, ...imgs.map(({ url }) => {
          return url
        })]
        this.list[index].contractimg = temp
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
    handleGetPicList (findex, index, { id, contractimg }, cb) {
      // if (!contractimg && !this.isUpdateReportState) return
      // if (typeof contractimg === 'object' && !this.isUpdateReportState) return
      getPicList({
        findex,
        bindId: id
      }).then(data => {
        console.log(data)
        const imgList = data && data.map(({ url }) => {
          return url
        })
        console.log(imgList)
        if (!cb) this.list[index].contractimg = imgList
        if (typeof cb === 'function') {
          console.log('cb')
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
    getList () {
      getUserList(this.searchForm).then(data => {
        console.log('这是包裹贴报备数据')
        console.log(data)
        this.list = data.list
        this.totalPages = data.total
        console.log(this.list)
      }).catch(err => {
        console.log('包裹贴报备列表失败：' + err.message)
      })
    },
    // 上传前
    handleupdate (type, file) {
      console.log('uploade')
      if (type !== 'video' && this.$fileController.imgSizeTooLarge(file)) {
        this.$message({
          type: 'error',
          message: `图片大小不能超过${this.$fileController.IMG_SIZE}mb`,
          duration: 900
        })
        return false
      }
      if (this.userid) {
        // 上传失败，显示上传中提示
        this.loading[type] = true
        return
      }
      this.$message({
        typ: 'error',
        message: '上传失败,请重新上传',
        duration: 900
      })
      return false
    },
    // 上传成功
    handleUploadSuccess (type, file, res) {
      file.id = res.data.id
      console.log('====')
      // console.log(file)
      // console.log(this.uploadUrls[type])
      // console.log(res)
      // console.log(file)
      console.log(res.data.url)
      // 上传成功，隐藏上传中提示
      if (this.loading[type]) this.loading[type] = false
      // certificater1: '',
      //   certificater2: '',
      //   certificater3: ''
      if (type) {
        this.newUploadedFiles[type].push(file)
      }
      if (type && type.indexOf('certificater') > -1) {
        const data = res.data
        this.uploadUrls[type].push({ uid: file.uid, id: data.id })
        // console.log(type)
      } else {
        this.uploadUrls[type] = URL.createObjectURL(file.raw)
      }
    },
    handleUplaodError (type, file) {
      // 上传失败，隐藏上传中提示
      if (this.loading[type]) this.loading[type] = false
    },
    handleDeletePic (fileId) {
      deletePic(fileId).then(data => {
        console.log('删除成功')
      }).catch(Err => {
        console.log('删除成功')
      })
    },
    handleRemove (file, fileList) {
      const { uid, status } = file
      if (status === 'exist') {
        file.status = 'delete'
        return
      }
      const { certificater3, certificater1, certificater2 } = this.uploadUrls
      const list = [...certificater3, ...certificater1, ...certificater2]
      console.log(list)
      list.forEach(item => {
        if (item.uid === uid) {
          console.log(item.id)
          deletePic(item.id).then(data => {
            console.log('删除成功')
          }).catch(Err => {
            this.$notify('删除失败')
          })
        }
      })
      // if (file) return
    },
    handleUploadCerticaterBefore (file) {
      if (this.$fileController.imgSizeTooLarge(file)) {
        this.$message({
          type: 'error',
          message: `图片大小不能超过${this.$fileController.IMG_SIZE}mb`,
          duration: 900
        })
        return false
      }
      if (this.userid) {
        return
      }
      this.$message({
        typ: 'error',
        message: '上传失败,请重新上传',
        duration: 900
      })
      return false
    },
    getPringLogisticPics ({ belongsRow, id }) {
      getReportDetail({
        id
      }).then(data => {
        this.list[belongsRow].headpic1 = data.headpic1
        this.list[belongsRow].headpic = data.headpic
      }).catch(err => {
        console.log('失败' + err.message)
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
    submitForm (formName) {
      const uploadUrls = this.uploadUrls
      // const uploadedImgs = this.uploadedImgs
      let certificater1Len = !uploadUrls.certificater1 ? 0 : uploadUrls.certificater1.length
      let certificater2Len = !uploadUrls.certificater2 ? 0 : uploadUrls.certificater2.length
      let certificater3Len = !uploadUrls.certificater3 ? 0 : uploadUrls.certificater3.length
      if (this.isUpdateReportState) {
        const { certificater1, certificater2, certificater3 } = this.uploadedImgs
        if (certificater1) {
          certificater1.forEach(item => {
            if (item.status !== 'delete') ++certificater1Len
          })
          certificater2.forEach(item => {
            if (item.status !== 'delete') ++certificater2Len
          })
          certificater3.forEach(item => {
            if (item.status !== 'delete') ++certificater3Len
          })
        }
      }
      console.log('======lengh')
      console.log(certificater1Len)
      console.log(certificater2Len)
      console.log(certificater3Len)
      // if (certificater2Len) return
      if (certificater1Len < 1) {
        this.$message({
          message: '请先上传投放证明正面特写（1-3张）',
          type: 'error'
        })
        return
      }
      if (certificater2Len < 3) {
        this.$message({
          message: '请上传投放证明正在粘贴（3-10张）',
          type: 'error'
        })
        return
      }
      if (certificater3Len < 3) {
        this.$message({
          message: '请上传投放证明堆积排列（3-10张）',
          type: 'error'
        })
        return
      }
      this.$refs[formName].validate((valid) => {
        const region = getUserInf().region
        if (valid) {
          console.log(this.$refs[formName])
          if (this.isUpdateReportState) {
            this.handleUpdateReport()
            return
          }
          const form = Object.assign({
            region,
            state: 0,
            userType: 3,
            id: this.userid
          }, this.ruleForm)
          addReport(form).then(data => {
            this.$message({ message: '提交成功', type: 'success', duration: 900 })
            this.getList()
            this.showReportDialog = false
            this.submitSuccess = true
            this.clearReportDialogFields()
            this.newUserId = null
          }).catch(err => {
            this.$message({ message: err.message, type: 'error', duration: 900 })
          })
        }
      })
    },
    handleUploadBefore (type, file) {
      if (this.$fileController.imgSizeTooLarge(file)) {
        this.$message({
          type: 'error',
          message: `图片大小不能超过${this.$fileController.IMG_SIZE}mb`,
          duration: 900
        })
        return false
      }
      if (this.userid) {
        this.loading[type] = true
        console.log(type)
        console.log(this.loading[type])
        return
      }
      this.$message({
        typ: 'error',
        message: '上传失败,请重新上传',
        duration: 900
      })
      return false
    },
    // 重置所填写的信息
    resetRuleForm () {
      const ruleForm = Object.assign({}, this.ruleForm)
      for (const key in ruleForm) {
        ruleForm[key] = null
      }
      this.ruleForm = ruleForm
      const uploadUrls = {
        logistics: '', // 印刷物流
        print: '', // 印刷物流
        video: '',
        certificater1: [],
        certificater2: [],
        certificater3: []
      }
      this.newUploadedFiles = {
        certificater1: [],
        certificater2: [],
        certificater3: [],
        logistics: [],
        print: [],
        video: []
      }
      this.uploadUrls = uploadUrls
      this.$refs.certificater1.clearFiles()
      this.$refs.certificater2.clearFiles()
      this.$refs.certificater3.clearFiles()
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    centerDialogVisible1 () {
      this.centerDialogVisible = false
      this.showReportDialog = false
      this.ruleForm = ''
    },
    // 大区改变
    handleRegionChange (regionName) {
      console.log(regionName)
      this.ruleForm.province = ''
      this.ruleForm.city = ''
      this.cityList = null
      this.provinceList = getProvinceListFromRegionName(regionName)
      console.log(getProvinceListFromRegionName(regionName))
    },
    // 处理省份改变
    handleProvinceChange (provinceName) {
      this.ruleForm.city = null
      this.cityList = getCityListFromProvinceName(provinceName)
    },
    // 处理城市选择
    handleCitySelect () {
      if (this.ruleForm.province) {
        console.log(this.ruleForm.province)
        this.cityMap = getCityMap(this.ruleForm.province)
      }
    },
    handleUploadChange (type, file) {
      console.log(file)
      if (this.isSubmitStatus) return
      this.uploadUrls[type] = URL.createObjectURL(file.raw)
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
    },
    // 加载视频
    handleLoadVideo ({ currentTarget }) {
      console.log('currentTarget')
      const src = currentTarget.dataset.src
      const videoNode = currentTarget.querySelector('video')
      const titleNode = currentTarget.querySelector('.title')
      titleNode.style.display = 'none'
      videoNode.src = src
      videoNode.style.display = 'block'
    }
  }
}
</script>

<style lang="less">
.action-box {
  .el-upload--picture-card {
    width: 60px;
    height: 60px;
    line-height: 60px;
    position: relative;
    i {
      font-size: 18px;
    }
  }
  .el-upload-list--picture-card {
    .el-upload-list__item {
      width: 60px;
      height: 60px;
    }
  }
}
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
.avatar-uploader {
  &.wuliu {
    .el-upload {
      margin-left: 15px;
    }
  }
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
    margin-top: 15px;
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
  // height: 180px;
  height: 133px;
  &.action-box {
    height: auto;
    padding-bottom: 5px;
  }
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
  padding-top: 10px;
  padding-left: 5px;
    padding-bottom: 50px;
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
.append-word {
  &::after {
    position: absolute;
    display: block;
    // content: '物流证明';
    top: 50%;
    left: 50%;
    margin-top: 3px;
    text-align: center;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    width: 100px;
    margin-left: -50px;
    color: #a7a6a6;
  }
  &.wuliu {
    &::after {
      // content: '物流证明';
      content: '\7269\6d41\8bc1\660e';
    }
  }
  &.yinshua {
    &::after {
      // content: '印刷证明';
      content: '\5370\5237\8bc1\660e';
    }
  }
  &.front-pic {
    &::after {
      font-size: 12px;
      content: '正面特写';
      content: '\6b63\9762\7279\5199';
    }
  }
  &.copy-paste {
    &::after {
      font-size: 12px;
      content: '正在粘贴';
      content: '\6b63\5728\7c98\8d34';
    }
  }
  &.order {
    &::after {
      font-size: 12px;
      content: '堆积排列';
      content: '\5806\79ef\6392\5217';
    }
  }
}
.video {
  width: 130px;
  height: 130px;
}
</style>
