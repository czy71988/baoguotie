<template>
  <div class="page">
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<!-- element-ui 公共样式 -->
<style lang="less">
.el-message-box {
  width: 95% !important;
  max-width: 420px;
}
.el-table {
  &.el-table--border {
    border: 1px solid #dad9d9;
    border-radius: 6px;
  }
  .el-table__fixed-header-wrapper, .el-table__header-wrapper {
    padding-bottom: 5px;
    color: #888;
    thead {
      .cell {
        color: #575353;
        font-weight: 800;
      }
    }
    .el-table__header {
      // border: 1px solid #dad9d9;
      border-top: none;
    }
  }
  .el-table__row {
    td {
      border-bottom: 1px solid #ede8e8;
    }
  }
  .el-table__body tr.hover-row>td {
    background-color: #ededed;
  }
}
.el-image-viewer__canvas {
  .el-image-viewer__img {
    min-width: 300px;
  }
}
.el-image-viewer__wrapper {
  .el-icon-circle-close {
    color: #ffffff;
  }
}
// form input项
.el-form-item {
  &.predend-icon-item {
    .el-input-group__prepend {
      padding-left: 0px;
      padding-right: 9px;
      background-color: #ffffff;
      border: none;
      .icon {
        width: 11.55px;
        height: 15.33px;
      }
    }
    .el-form-item__error {
      padding-left: 21px;
    }
    .el-input__inner {
      border-radius: 3.3px;
    }
  }
  &.append-icon-item {
    .el-input-group__append {
      padding-left: 0px;
      padding-right: 0px;
      background-color: #ffffff;
      border: none;
    }
  }
}
// 上传图片的成功的勾子 样式
.multiple-uploader-box {
  .el-icon-check {
    position: absolute;
    top: 1px;
    right: 14px;
  }
}
</style>
<!-- 公共样式 -->
<style lang="less">
.c-red {
  color: #F56C6C;
  margin-right: 4px;
}
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  opacity: .8;
}
.clearfix::after, .clearfix::before {
  display: block;
  content: ' ';
  clear: both;
}
* {
  padding: 0px;
  margin: 0px;
}
// 按钮
button {
  border: none;
  outline: none;
}
.btn-group {
  text-align: center;
  .btn {
    background-color: #fe2a50;
    color: #ffffff;
    width:6.453333rem;
    font-size:14px;
    height: 40px;
    line-height: 40px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(255,255,255,1);
    border-radius: 60px;
  }
}
// 遮罩
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: .5;
  background: #000;
  z-index: 900;
  display: none;
  &.show {
    display: block;
  }
}
.overflow-hidden {
  // position: fixed;
  // top: 0px;
  // left: 0px;
  // width: 100%;
  overflow: hidden;
}
// 分页样式
.pagination {
  margin-top: 15px;
  text-align: right;
}
.common-btn, .reset-btn {
  // width: 80px;
  height: 53px;
  border: 1px solid #cbcccd;
  border-radius: 10px;
  padding:0px 20px;
  text-align: center;
  line-height: 51px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-size: 18px;
  color: #333333;
  background-color: #ffffff;
  margin-right: 20px;
  cursor: pointer;
}
</style>
<style lang="less" scoped>
body {
  width: 100%;
}
.page {
  width: 100%;
}
</style>
<!-- van 公共样式 -->
<style lang="less">
.van-swipe__indicators {
  // bottom: -10px;
  // z-index: 1000;
  .van-swipe__indicator {
    background-color: #FF2746;
    opacity: .5;
    &.van-swipe__indicator--active {
      opacity: 1;
    }
  }
}
.van-overflow-hidden {
  overflow: auto !important;
}
.van-overlay {
  // display: none;
}
</style>
