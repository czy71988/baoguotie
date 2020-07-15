<template>
<!-- // admin
// Zku18521364035 -->
  <div class="KDC">
    <div class="top">
      <input class="input" v-model="customerName_1" placeholder="请输入要搜索的客户名称">
      <button class="btn-1" @click="handleSearch">搜索</button>
      <button class="btn reset-btn" @click="handleResetSearch">重置</button>
      <button class="btn common-btn export-btn" @click="handleExport">导出</button>
      <button class="btn-2" @click="handleAddReport">新增包裹贴报备</button>
    </div>

    <div class="content">
      <el-table
        :data="list"
        border
        fit
        style="width: 100%">
        <el-table-column
          prop="reportedCompany_"
          label="报备公司"
          align="center">
        </el-table-column>
        <el-table-column
          prop="customerName_"
          label="客户名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="contactWay_"
          label="联系方式"
          align="center">
        </el-table-column>
        <el-table-column
          label="投放城市"
          align="center">
          <template slot-scope="scope">
            {{scope.row.putProvince_}} {{scope.row.putCity_}}
          </template>
        </el-table-column>
        <el-table-column
          prop="putNetwork_"
          label="投放网点"
          align="center">
        </el-table-column>
        <el-table-column
          prop="putTime_"
          label="投放日期节点"
          align="center">
        </el-table-column>
        <el-table-column
          prop="putNumber_"
          label="投放数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="putNumber_"
          label="图片证明"
          width="120"
          align="center">
          <template slot-scope="scope">
            <div v-if="!scope.row.showImg" @click="chaknatupian(scope.$index, scope.row)">
                点击查看图片
            </div>
            <div v-else class="demo-image__preview">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.imglist[0]"
                :preview-src-list="scope.row.imglist">
              </el-image>
            </div>

            <!-- <big-img v-if="showImg" :imgSrc="imglist"></big-img> -->
          </template>
        </el-table-column>
        <el-table-column
          label="视频证明"
          width="120"
          align="center">
          <template slot-scope="scope">
            <div class="title"
            @click="handleLoadingVideo(scope.$index, scope.row)">
                点击加载视频
            </div>
            <!-- <video
              style="width: 120px; height: 63px"
              :src="videourl"
              controls>
            </video> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="reportedTime_"
          align="center"
          label="报备时间">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleOpenEditReportDialog(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleAddReportWithCopyRow(scope.row)">新增</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog :visible.sync="showReportDialog" min-width="800px" @close="clearReportDialogFields">
      <div class="zhixing-1">
        <p v-if="this.jjjjjjj === '1'" class="p1">新增快递车报备</p>
        <p v-else-if="this.jjjjjjj === '2'" class="p1">编辑快递车报备</p>
        <p v-else class="p1">新增节点报备</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" >
          <el-form-item label="客户名称" prop="customerName_">
            <el-input :disabled="idshh" v-model="ruleForm.customerName_" placeholder="请输入客户名称"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="contactWay_">
            <el-input :disabled="idshh" v-model="ruleForm.contactWay_" placeholder="请输入手机号" v-pure-number></el-input>
          </el-form-item>
          <div><span class="c-red">*</span>投放城市</div>
          <el-form-item prop="putProvince_">
            <el-select :disabled="idshh" v-model="ruleForm.putArea_" placeholder="地区  （必 填）" class="aj6" @change="handleRegionChange">
              <el-option v-for="(item, index) in regionList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <el-select :disabled="idshh" v-model="ruleForm.putProvince_" placeholder="省份  （必 填）" class="aj6" @change="handleProvinceChange">
              <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <el-select :disabled="idshh" v-model="ruleForm.putCity_" placeholder="城市  （必 填）" class="aj6">
              <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投放网点" prop="putNetwork_">
            <el-input :disabled="idshh" v-model="ruleForm.putNetwork_" placeholder="请输入投放网点"></el-input>
          </el-form-item>
          <div>
            <el-form-item label="投放日期节点" prop="putTime_" disabled = "false">
              <el-col :span="10">
                <el-date-picker type="date" placeholder="请选择投放日期" v-model="ruleForm.putTime_" style="width: 85%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item label="投放数量" prop="putNumber_">
            <el-input :disabled="idshh" v-model="ruleForm.putNumber_" v-pure-number placeholder="请输入投放数量"></el-input>
          </el-form-item>
          <div class="sdivb clearfix">投放证明</div>
          <div class="drvdfvb clearfix"><span class="c-red">*</span>1、图片证明<span class="c-red" style="font-size:12px;margin-left:13px"></span></div>
          <div class="hbdfbvdf action-box multiple-uploader-box">
            <el-upload
              multiple
              action=""
              :file-list="imgarr"
              :on-remove="removeimg"
              :auto-upload="false"
              list-type="picture-card"
              :on-change="(file,fileList) => {handleChange(file,fileList,'img')}"
              >
              <!-- <video :src="imgarr[0]"></video> -->
              <i class="el-icon-plus append-word front-pic" ></i>
            </el-upload>
          </div>
          <div class="newwenan">
            <p>快递三轮车广告 · 拍照要求 </p>
            <p>1. 特写照片：让整辆车带广告侧充满整个照片画面（每辆车每个广告侧2张，编号清晰可见。一侧一尾两个画面的，用侧拍方式，让两个侧和尾两个面同时都纳入</p>
            <p>2. 上画照片：正在张贴广告时的场景（每个网点2-4张）</p>
            <p>3. 远景照片：3-5米外远拍多辆并排的已贴快递车（2-4 张），拍出气势感</p>
          </div>
          <!-- 视频证明 -->
          <div class="drvdfvb clearfix"><span class="c-red">*</span>2、视频证明<span class="c-red" style="font-size:12px;margin-left:13px"></span></div>
          <div class="hbdfbvdf action-box multiple-uploader-box">
            <el-upload
              multiple
              action=""
              :file-list="videoarr"
              :on-remove="removeimg"
              :auto-upload="false"
              list-type="picture-card"
              :on-change="(file,fileList) => {handleChange(file,fileList,'video')}"
              >
              <!-- <video v-if="videoarr" :src="videoarr" class="video" controls="controls"></video> -->
              <i class="el-icon-plus append-word front-pic" ></i>
            </el-upload>
          </div>
          <div class="newwenan">
            <p> 短视频：网点上画完成后，拍一个60秒以内的小视频</p>
          </div>
          <el-form-item>
            <p id="newredwenan">涵括所有上画车辆注明要求2-4张时，意为2张为底限要求，请尽量多拍几张，以备选择余地。</p>
            <el-button class="submit-btn" type="primary" @click="submitForm"  v-if="this.jjjjjjj ==='1'">提交</el-button>
            <el-button class="submit-btn" type="primary" @click="submitForm1"  v-else-if="this.jjjjjjj ==='2'">提交1</el-button>
            <el-button class="submit-btn" type="primary" @click="submitForm2"  v-else>提交2</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 视频展示列表 -->
    <div class="shiPtankuang">
      <el-dialog :visible.sync="dialogVisible">
          <video width="800" height="444"  v-if="videoarr" :src="videoarr[0]" class="video" controls="controls"></video>
      </el-dialog>
    </div>

  </div>
</template>

<script>

// import BigImg from './BigImg'
import actions from '../../config/ima'
import { getCityMap } from '@/components/uitl/china-location'
import { getRegionList, getProvinceListFromRegionName, getCityListFromProvinceName } from '@/components/uitl/jsAddress.js'
import { huoquzhujiankdc, getUserList1, KDCimgORvideo, KDCnewdate, KDCxiugai, KDCremoveimg } from '../../api/index'
export default {
  data () {
    var checkcontactWay_ = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1\d{10}$/
        // console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      url: '',
      imglists: [],
      videolists: [],
      listimgs: [],
      imgarr: [],
      videoarr: [],
      customerName_1: '',
      ruleForm: {
        expressCarId_: '', // 主键ID
        customerName_: '', // 搜索表单
        contactWay_: '',
        putArea_: '',
        putProvince_: '',
        putCity_: '',
        putNetwork_: '',
        putTime_: '',
        putNumber_: '',
        imgurl: '',
        videourl: ''
      },
      timestamp: Date.parse(new Date()),
      row: 1,
      size: 10,
      actions,
      regionList: getRegionList(),
      total: 0,
      currentPage4: 1,
      list: [],
      showImg: false,
      imgurl: '',
      videourl: '',
      jjjjjjj: '1',
      showReportDialog: false,
      provinceList: null,
      cityList: null,
      idshh: false,
      dialogVisible: false,
      nu: '0',
      rules: {
        customerName_: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        putNumber_: [
          { required: true, message: '请输入投放数量', trigger: 'blur' }
        ],
        putTime_: [
          { required: true, message: '请输入投放日期', trigger: 'blur' }
        ],
        putCity_: [
          { required: true, message: '请输入投放城市', trigger: 'blur' }
        ],
        putNetwork_: [
          { required: true, message: '请输入投放网点', trigger: 'blur' }
        ],
        contactWay_: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkcontactWay_, trigger: 'blur' }
        ]
      }
    }
  },
  // components: { 'big-img': BigImg },
  created () {
  },
  mounted () {
    this.getlist()
  },
  methods: {
    // 清除报备弹窗里字段数据
    clearReportDialogFields () {
      this.ruleForm = {}
      this.imglists = []
      this.videolists = []
      this.listimgs = []
      this.imgarr = []
      this.videoarr = []
      // console.log('清除数据中-------')
    },
    // 搜索按钮
    handleSearch () {
      this.row = 1
      this.size = 10
      // console.log('搜索按钮')
      this.getlist()
    },
    // 重置按钮
    handleResetSearch () {
      // console.log('重置按钮')
      // this.relocate()
    },
    // 导出按钮
    handleExport () {
      // console.log('导出按钮')
    },
    // 新增按钮
    handleAddReport () {
      // console.log('新增按钮')
      this.id()
      this.jjjjjjj = '1'
      // console.log('jjjjj', this.jjjjjjj)
      this.idshh = false
      // this.ruleForm = {}
      this.showReportDialog = true
      // console.log('新增报备ID', this.ruleForm.expressCarId_)
    },
    // 新增操作
    submitForm () {
      KDCnewdate({
        expressCarId_: this.ruleForm.expressCarId_,
        customerName_: this.ruleForm.customerName_,
        contactWay_: this.ruleForm.contactWay_,
        putArea_: this.ruleForm.putArea_,
        putProvince_: this.ruleForm.putProvince_,
        putCity_: this.ruleForm.putCity_,
        putNetwork_: this.ruleForm.putNetwork_,
        putTime_: this.ruleForm.putTime_,
        putNumber_: this.ruleForm.putNumber_
      }).then(data => {
        // console.log('新建成功', this.ruleForm)
        this.showReportDialog = false
        this.$message({ message: '新建成功', type: 'success', duration: 900 })
        this.clearReportDialogFields()
        this.getlist()
      })
    },
    // 编辑按钮
    handleOpenEditReportDialog (row) {
      this.jjjjjjj = '2'
      this.idshh = false
      this.ruleForm = row
      this.showReportDialog = true
      this.ruleForm.expressCarId_ = row.expressCarId_
      // console.log('编辑ID', this.ruleForm.expressCarId_)
      KDCimgORvideo({
        relationId_: row.expressCarId_
      }).then(data => {
        // console.log('这是图片', data)
        let arr = []
        let arr1 = []
        data.forEach((ele) => {
          ele.findex.indexOf('img') > -1 ? arr.push({ 'url': ele.fileUrl_, 'findex': ele.findex, 'id': row.expressCarId_ }) : arr1.push({ 'url': ele.fileUrl_, 'findex': ele.findex, 'id': row.expressCarId_ })
        })
        this.imgarr = arr
        // arr1.forEach(ele => {
        //   this.videoarr.push(ele.url)
        // })
        this.videoarr = arr1
        // console.log('获取的图片集[[[[[', this.imgarr)
        // console.log('获取的视频集[[[[[', this.videoarr)
      })
    },
    // 查看图片
    chaknatupian (index, row) {
      let that = this

      // this.list[index].showImg = true
      KDCimgORvideo({
        relationId_: row.expressCarId_
      }).then(data => {
        let arr = []
        let arr1 = []
        data.forEach((ele) => {
          ele.findex.indexOf('img') > -1 ? arr.push(ele.fileUrl_) : arr1.push(ele.fileUrl_)
        })
        row.imglist = arr
        row.showImg = true
        that.$set(that.list, index, row)
        console.log('这是图片', row)
      })
    },
    // 查看视频
    handleLoadingVideo (index, row) {
      this.dialogVisible = true
      KDCimgORvideo({
        relationId_: row.expressCarId_
      }).then(data => {
        let arr = []
        let arr1 = []
        data.forEach((ele) => {
          ele.findex.indexOf('video') > -1 ? arr.push(ele.fileUrl_) : arr1.push(ele.fileUrl_)
        })
        this.videoarr = arr
        // console.log('这是视频', row)
        // row.videolist = this.videolists
      })
    },
    // 图片移除时间
    removeimg (file, filelist) {
      // console.log('移除', file, filelist)
      // console.log('移除的图片index', file.findex)
      KDCremoveimg({
        relationId_: file.id,
        findex: file.findex
      }).then(data => {
        // console.log('删除成功')
      })
    },

    // 编辑操作
    submitForm1 () {
      KDCxiugai({
        expressCarId_: this.ruleForm.expressCarId_,
        customerName_: this.ruleForm.customerName_,
        contactWay_: this.ruleForm.contactWay_,
        putArea_: this.ruleForm.putArea_,
        putProvince_: this.ruleForm.putProvince_,
        putCity_: this.ruleForm.putCity_,
        putNetwork_: this.ruleForm.putNetwork_,
        putTime_: this.ruleForm.putTime_,
        putNumber_: this.ruleForm.putNumber_
      }).then(data => {
        this.showReportDialog = false
        this.$message({ message: '修改成功', type: 'success', duration: 900 })
        // this.clearReportDialogFields()
        this.getlist()
      })
      this.clearReportDialogFields()
    },
    // 新增节点按钮
    handleAddReportWithCopyRow (row) {
      this.jjjjjjj = '3'
      // console.log('jjjjj', this.jjjjjjj)
      this.idshh = true
      this.ruleForm = row
      // console.log('编辑', this.ruleForm)
      this.showReportDialog = true
      // console.log('ID', this.ruleForm.expressCarId_)
      this.id()
      // console.log('新添加的ID', this.ruleForm.expressCarId_)
    },
    // 新增节点操作
    submitForm2 () {
      KDCnewdate({
        expressCarId_: this.ruleForm.expressCarId_,
        customerName_: this.ruleForm.customerName_,
        contactWay_: this.ruleForm.contactWay_,
        putArea_: this.ruleForm.putArea_,
        putProvince_: this.ruleForm.putProvince_,
        putCity_: this.ruleForm.putCity_,
        putNetwork_: this.ruleForm.putNetwork_,
        putTime_: this.ruleForm.putTime_,
        putNumber_: this.ruleForm.putNumber_
      }).then(data => {
        this.showReportDialog = false
        this.$message({ message: '新建节点成功', type: 'success', duration: 900 })
        this.clearReportDialogFields()
        this.getlist()
      })
    },
    // --------
    // 获取主键ID
    id () {
      // this.clearReportDialogFields()
      // this.ididid = []
      // alert('删除缓存的ID')
      huoquzhujiankdc({}).then(data => {
        // console.log(lr + '获取的ID', data)
        this.ruleForm.expressCarId_ = data
        // console.log('获取的ID', this.ididid)
      })
    },
    // wan () {
    getlist () {
      this.ruleForm.customerName_ = this.customerName_1
      getUserList1({
        pageNo: this.row,
        pageSize: this.size,
        customerName_: this.ruleForm.customerName_
      }).then(data => {
        this.total = data.total
        this.list = data.list
      })
    },
    // 分页
    handleSizeChange (val) {
      this.size = val
      this.getlist()
    },
    handleCurrentChange (val) {
      this.row = val
      this.getlist()
    },
    // 大区改变
    handleRegionChange (regionName) {
      // console.log(regionName)
      this.ruleForm.putProvince_ = ''
      this.ruleForm.putCity_ = ''
      this.cityList = null
      this.provinceList = getProvinceListFromRegionName(regionName)
      // console.log(getProvinceListFromRegionName(regionName))
    },
    // 处理省份改变
    handleProvinceChange (provinceName) {
      this.ruleForm.putCity_ = null
      this.cityList = getCityListFromProvinceName(provinceName)
    },
    // 处理城市选择
    handleCitySelect () {
      if (this.ruleForm.provinputProvince_ce) {
        // console.log(this.ruleForm.proputProvince_ince)
        this.cityMap = getCityMap(this.ruleForm.putProvince_)
      }
    },
    // 上传图片
    handleChange (file, fileList, type) {
      // this.imglist = []
      // this.imglist.splice(0, this.imglist.length)
      // this.fileList = fileList.slice(-3)
      // console.log(file)
      // console.log(file)
      const form = new FormData()
      form.append('file', file.raw)
      form.append('relationId_', this.ruleForm.expressCarId_)
      form.append('findex', type + this.imglists.length + 1)
      this.$axios({
        url: this.actions.kdcimg,
        method: 'POST',
        data: form
      }).then(res => {
        if (type === 'img') {
          this.imglists.push(res)
        } else if (type === 'video') {
          this.videolists.push(res)
        }
        // console.log('ffff', this.imglists)
        // this.clearReportDialogFields()
      }).catch(err => {
        console.log(err)
      })
    }

  }
}
</script>

<style lang="less">
.shiPtankuang {
  .el-dialog{
    width: 800px !important;
    height: 444px !important;
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
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
  #newredwenan {
    font-size: 10px;
    color: red;
    line-height: 16px;
    margin: 0;
    margin-top: 25px;
  }

}

</style>

<style lang="less" scoped>
.content {
  // height: 100%;
  background-color: #fff;
}
.KDC {
  height: 100%;
  position: relative;
  background-color: #fff;
  .top {
    // width: 100%;
    // margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
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
  .block {
    margin-top: 30px;
    margin-left: 80px;
    background-color: #fff;
    margin-right: 30px;
    bottom: 80px;
    box-sizing: border-box;
  }
  .zhixing-1 {
    width: 500px;
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
    .newwenan {
      margin-bottom: 25px;
      p {
        font-size: 14px;
        line-height: 16px;margin: 0;
      }
    }
  }
}
</style>
