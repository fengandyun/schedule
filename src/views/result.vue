<template>
  <div class="content">
    <div class="content-body left">
      <p>{{year}}年{{month}}月</p>
      <div
        class="basic-info"
      >{{$route.query.group}}-{{$route.query.type}}-{{$route.query.dutyAccount}}-值班信息</div>
      <!-- 选择器，前后三个月 -->
      <div class="week-title center">
        <el-row :gutter="0">
          <el-col class="width7">
            <span>一</span>
          </el-col>
          <el-col class="width7">
            <span>二</span>
          </el-col>
          <el-col class="width7">
            <span>三</span>
          </el-col>
          <el-col class="width7">
            <span>四</span>
          </el-col>
          <el-col class="width7">
            <span>五</span>
          </el-col>
          <el-col class="width7">
            <span>六</span>
          </el-col>
          <el-col class="width7">
            <span>日</span>
          </el-col>
        </el-row>
      </div>
      <div class="week-day center " v-if="!noSchedule">
        <el-row :gutter="0" v-for="(item,index) in personDayList" :key='index' class="pd5">
          <el-col v-for="(info,infoIndex) in item" :key='infoIndex' class="width7">
            <div>{{info.day}}</div>
            <div>{{info.dutyPerson}}</div>
          </el-col>
        </el-row>
      </div>
      <div class="no-schedule center" v-if="noSchedule">
        <p>无排班信息</p>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { http, url } from "../libs/http";

export default {
  name: "result",
  data() {
    return {
      year: "",
      month: "",
      personDayList:[], // 二维数组，渲染最后的list
      noSchedule: false
    };
  },
  mounted() {
    let inYearMonthArr = this.$route.query.yearMonth.split("-");
    this.year = inYearMonthArr[0];
    this.month = inYearMonthArr[1];
    this.getResult();
    // this.nullDayList = this.getYMWeekDays(this.year,this.month);
  },
  methods: {
    getResult(){
      let that =  this;
      http(url.search,this.$route.query).then(data => {
        // console.log(data);
        // 转换数据结构，初始化所有的值班人和值班号选择列表 
        // this.selectPersons  this.accountOptions
        // debugger
        // let allDayList = Object.assign({},data,that.nullDayList);
        // 处理下，每7个组成一周
        // data= [];
        if(data.length < 1){
          that.noSchedule = true;
          return;
        }
        let arr = [];
        for(let i = 0; i < data.length; i ++ ){
          arr.push(data[i]);
          if(i != 0 && (i+1) % 7 == 0){
            that.personDayList.push(arr);
            arr = [];
          }
          // 最后做一次 兜底的判断  如果数据有问题，就把剩余的数据进行一次加入
          if(arr.length > 0 && i == data.length - 1){
            that.personDayList.push(arr);
          }
        }
      });
    },
  }
};
</script>
<style scoped>
.content-body {
  /* border-width: 1px;
  border-style: solid;
  border-color: rgb(235, 235, 235);
  border-image: initial;
  border-radius: 3px;
  transition: all 0.2s ease 0s; */
  display: block;
  padding: 10px 0px;
}
.basic-info {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
}
.width7 {
  width: 14.25% !important;
}
.pd5 {
  padding: 8px 0;
  border-bottom: 1px solid #ccc;
}
.week-title {
  font-weight: 500;
  padding: 15px 0px;
  background-color: #eee;
  border-bottom: 1px solid #ccc;
}
.week-day {
  font-size: 14px;
}
.no-schedule p{
  font-size: 16px;
  font-weight: 500;
}
</style>
