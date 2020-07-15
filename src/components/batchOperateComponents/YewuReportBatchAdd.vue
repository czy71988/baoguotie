<template>
  <div class="inner-page">
    <div class="tilte">
      业务报备批量添加
      <span>
        <el-button v-if="submitStatus !== 'success'" class="btn" style="margin-left: 50px" type="primary" size="small" @click="hanndleNewRow(0)">新增</el-button>
        <el-button v-if="submitStatus !== 'success'" class="btn" type="primary" size="small" @click="handleSubmit">提交</el-button>
        <el-button class="btn" type="primary" size="small" @click="$router.go(-1)">返回</el-button>
      </span>
    </div>
    <el-table :data="tableList" border highlight fit style="width: 100%">
      <el-table-column fixed prop="username" label="客户名称" align="center">
        <!-- <template slot-scope="scope">
          <el-input placeholder="请填写客户名称" v-model="scope.row.username"></el-input>
        </template> -->
      </el-table-column>
      <el-table-column prop="phone" label="联系方式" align="center"></el-table-column>
      <el-table-column prop="ctprice" label="客户价格" align="center"></el-table-column>
      <el-table-column prop="ctsource" label="客户来源" align="center"></el-table-column>
      <el-table-column label="投放城市" align="center">
        <template slot-scope="scope">{{scope.row.province}} {{scope.row.city}}</template>
      </el-table-column>
      <el-table-column prop="dot" label="投放网点" align="center"></el-table-column>
      <el-table-column label="投放周期" align="center">
        <template slot-scope="scope"><div v-show="scope.row.startTime">{{scope.row.startTime}}到{{scope.row.endTime}}</div></template>
      </el-table-column>
      <el-table-column prop="number" label="投放数量" align="center"></el-table-column>
      <!-- <el-table-column prop="createTime" align="center" label="报备时间"></el-table-column> -->
      <el-table-column label="操作" align="center" v-if="submitStatus !== 'success'">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleOpenEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="hanndleNewRow(scope.$index, scope.row)">复制</el-button>
          <el-button type="text" size="small" @click="hanndleDeleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <yewu-report-batch-add-edit v-model="showEdit" :ruleForm="editingData.row" @submitOk="handleEditOkSumbit"></yewu-report-batch-add-edit>
  </div>
</template>

<script>
import { createUserId, addReport } from '@/api'
import { getUserInf } from '@/utils/userInf'
import YewuReportBatchAddEdit from './YewuReportBatchAddEdit.vue'
export default {
  components: {
    YewuReportBatchAddEdit
  },
  data () {
    return {
      tableList: [],
      showEdit: false, // 显示编辑页
      defaultRow: {
        id: '',
        username: '',
        phone: '',
        ctprice: '', // 客户价格
        ctsource: '', // 客户来源
        area: '',
        province: '',
        city: '',
        dot: '',
        startTime: null,
        endTime: null,
        number: '',
        contractimg: ''
      },
      editingData: { // 编辑的数据
        index: 0,
        row: {}
      },
      editedRowIdsMapRowInf: {},
      submitStatus: 'fail'
    }
  },
  mounted () {
    // this.id()
    this.createReport()
  },
  methods: {
    createReport (index = 0, copyedRow = {}, cb) {
      console.log(copyedRow)
      createUserId().then(id => {
        const newRow = Object.assign({}, this.defaultRow, copyedRow, { id })
        console.log(id)
        newRow.contractimg = null
        this.tableList.splice(index, 0, newRow)
        console.log(this.tableList)
        if (typeof cb === 'function') {
          cb(this.tableList[index])
        }
      })
    },
    // 打开编辑页
    handleOpenEdit (index, row) {
      this.editingData.index = index
      this.editingData.row = Object.assign({}, row)
      this.showEdit = true
    },
    hanndleNewRow (index, row) {
      this.createReport(index + 1, row, (row) => {
        this.uploadPic(row.id, res => {
          // row.contractimg = 'https://img.alicdn.com/tfs/TB1f4tKzxD1gK0jSZFsXXbldVXa-520-280.jpg_q75.jpg_.webp'
        })
      })
    },
    hanndleDeleteRow (index) {
      this.tableList.splice(index, 1)
    },
    // 编辑页确认提交
    handleEditOkSumbit (editedInf) {
      // 确认提交
      console.log(editedInf)
      this.tableList.splice(this.editingData.index, 1, editedInf.ruleForm)
      this.editedRowIdsMapRowInf[editedInf.ruleForm.id] = editedInf
      // this.tableList[this.editingData.index] = ruleForm
    },
    // 提交
    handleSubmit () {
      const tableList = this.tableList
      if (!tableList || tableList.length < 1) {
        this.$message({
          type: 'error',
          message: '未有需上传的记录',
          duration: 900
        })
        return
      }
      const length = tableList.length
      for (let i = 0; i < length; i++) {
        if (!tableList[i].username) {
          this.$message({
            type: 'error',
            message: `第【${i + 1}】行信息未填写完毕, 请填写完毕后再提交`,
            duration: 2000
          })
          return
        }
      }
      this.handleAddReport()
    },
    uploadPic (fileId, cb) {
      if (fileId) {
        cb(fileId)
      }
    },
    handleAddReport () {
      const tableList = this.tableList
      this.uploadedSuccessLen = 0
      const length = tableList.length
      tableList.forEach((row, index) => {
        const form = Object.assign({
          state: 0,
          userType: 2
        }, row, {
          region: getUserInf().region
        })
        delete form.contractimg
        addReport(form).then(data => {
          console.log('上传成功', index)
          this.judegeSubmitSuccess(length)
        }).catch(err => {
          console.log('添加失败' + err.message, index)
        })
      })
    },
    judegeSubmitSuccess (sumLen) {
      this.uploadedSuccessLen = this.uploadedSuccessLen + 1
      if (sumLen === this.uploadedSuccessLen) {
        this.$message({
          type: 'success',
          message: '提交成功',
          duration: 2000
        })
        this.submitStatus = 'success'
      }
    }
  }
}
</script>

<style lang="less">
.inner-page {
  width: 100%;
  background-color: #ffffff;
  height: 100%;
  padding-bottom: 30px;
  .tilte {
    font-size: 22px;
    color: #888;
    padding-top: 30px;
    padding-left: 20px;
    padding-bottom: 10px;
  }
  .btn {
    margin-right: 15px;
  }
}
</style>
