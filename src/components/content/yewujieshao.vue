<template>
  <div class="daili">
    <div class="daili-1">
      <p class="p1">一、业务简介</p>
      <div class="div-p1">
        <p class="p2">包裹贴广告，是粘贴在快递包裹上、随包裹一同进入千家万户的一种广告形式，具有精准、醒目、高渗透率等特点，是伴随电商大发展而兴起的一种高效传播载体。</p>
        <p class="p2"> 每天可投放4000万张
          <br>
          每月累计可投放12亿张
          <br>
          在到件中心/网点粘贴，可精准投放
          <br>
          产品转化率平均3-5%
        </p>
        <img src="../../assets/位图.png" alt="">
        <p class="p3">资源优势</p>
        <p class="p2">
           大流量（日包裹量超过4000万件，每日可触达亿万用户）<br>高精准（到件中心操作，可实现精准区域投放）<br>全覆盖（中通快递覆盖全国97%的地区，快递送到哪，广告就展示到哪）<br>强垂直（国人每年使用中通快递超百亿次，主流受众人群为18-45岁的网购消费者，网购习惯强，消费能力高）
        </p>
      </div>
      <p class="p1">二、业务报备</p>
      <div class="div-p1">
        <div class="p2"> 要求：①四个后台管理端口（中快、区域公司、三通一达、客户/代理）</div>
        <div class="p2 hjdbfv"> ②报备的信息可以后台导出（例如表单形式）</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.daili {
    width: 100%;
    // height: 100%;
    background-color: #fff;
    margin: 0 auto;
    .daili-1 {
      width: 100%;
      // height: 100%;
      // text-align: center;
      // margin: 0 auto;
      // padding-top: 120px;
      padding: 40px;
      box-sizing: border-box;
      .p1 {
        font-size:30px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(229,1,19,1);
        line-height:42px;
      }
      .div-p1 {
        margin-left: 60px;
        .p2 {
          font-size:28px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(51,51,51,1);
        }
        img {
          margin-top: 45px;
          margin-bottom: 35px;
        }
        .p3 {
          font-size: 30px;
          color: #333333;
        }
        .hjdbfv {
          margin-left: 82px;
        }
      }
    }
}
</style>
