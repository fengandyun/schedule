<template>
  <div class="content">
    <h4>值班信息维护</h4>
    <div class="content-body">
      <p>基本信息</p>
      <div class="basic-info">
        <div class="basic-info-title">
          <el-row :gutter="0">
            <el-col :span="6">
              <div class="grid-content">月份</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-content">组别 / 班期 / 值班号</div>
            </el-col>
          </el-row>
        </div>
        <div class="basic-info-name">
          <el-row :gutter="0">
            <el-col :span="6">
              <el-select size v-model="selectMonth" @change="changeMonth" placeholder="请选择">
                <el-option
                  v-for="item in selectMonths"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="18" class="cascader-left">
              <el-cascader
                size
                :clearable="true"
                placeholder="试试搜索：阿奇"
                :options="accountOptions"
                filterable
                @change="accountChange"
                v-model="selectAccountOption"
              ></el-cascader>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 选择器，前后三个月 -->
      <div class="all-months">
        <el-row :gutter="0">
          <el-col :span="6" class="center">
            <el-button size type="success" @click="selectAllMonth()">选择整月</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="select-day">
        <div class="select-day-header">
          <el-row :gutter="0">
            <el-col :span="4" class="center">
              <div class>周选</div>
            </el-col>
            <el-col :span="20" class="center">
              <div>按日选择</div>
            </el-col>
          </el-row>
        </div>
        <div class="select-day-body">
          <!-- 日期显示，动态修改 dom 元素 -->
          <div class="week-line" v-for="(item,weekIndex) in selectDates" :key="weekIndex">
            <el-row :gutter="0" class="grid-line">
              <el-col :span="3" class="grid center">
                <div
                  class="font14 circle"
                  :class="{ 'bc-green': item.weekStatus}"
                  @click="changeWeekStatus(item.weekStatus,weekIndex)"
                >整周</div>
              </el-col>
              <el-col
                :span="3"
                v-for="(info,dayIndex) in item.weekList"
                :key="info.date"
                class="grid center"
              >
                <div
                  class="circle"
                  :class="{ 'bc-green': info.status}"
                  @click="changeDayStatus(item.weekStatus,info.status,weekIndex,dayIndex)"
                >{{info.day}}</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="select-day-footer">
          <!-- 选择器 -->
          <el-row :gutter="0">
            <el-col :span="16" class="left">
              <el-select size v-model="selectPerson" multiple filterable placeholder="选择值班人(先选值班号)">
                <el-option
                  v-for="item in selectPersons"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="right">
              <el-button type="primary" @click="submitScheduling">提 交</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { http, url } from "../libs/http";

export default {
  name: "home",
  data() {
    return {
      selectMonth: "", // 默认选中当前月
      selectAccountOption: [], // 选中的值班号,单选
      accountOptions: [], // 值班号多级选择
      selectPerson: [], // 选中的值班人,单选
      selectPersons: [], // 值班人
      selectMonths: [], // 当前可选的月份
      selectDates: [], // 供选择的日期
      fromDate: "", // 月份开始日期
      toDate: "", // 月份结束日期
      allMonthFlag: false, // 是否全选中或不选
      personsAndAccountsStorage: []
    };
  },
  mounted() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    this.selectMonth = currentYear + "-" + currentMonth;
    let previousYear = currentYear;
    let previousMonth = currentMonth - 1;
    let nextYear = currentYear;
    let nextMonth = currentMonth + 1;

    // 有可能跨年
    if (currentMonth == 1) {
      previousYear = currentYear - 1;
      previousMonth = 12;
    }
    if (currentMonth == 12) {
      nextYear = currentYear + 1;
      nextMonth = 1;
    }
    this.selectMonths = [
      {
        label: previousMonth + "月",
        value: previousYear + "-" + previousMonth
      },
      { label: currentMonth + "月", value: currentYear + "-" + currentMonth },
      { label: nextMonth + "月", value: nextYear + "-" + nextMonth }
    ];
    this.getPersonAndAccount(); // 获取所有的值班人和值班号
    this.selectDates = this.getYMWeek(currentYear, currentMonth);
    // console.log(JSON.stringify(this.selectDates));
    
  },
  methods: {
    submitScheduling() {
      // console.log('111');
      // sensors.track('gz',{});
      alert('假装已提交');
      return false;
      // sensors.track('gz',{}
      // sensors.track('gz',{});
      // 提交排班信息
      // 整理提交数据的param
      let param = {
        yearMonth: this.selectMonth,
        group: "",
        type: "",
        dutyAccount: "",
        dutyPerson: "",
        dateInfo: []
      };
      // debugger
      if (this.selectAccountOption.length > 0) {
        param.group = this.selectAccountOption[0];
        param.type = this.selectAccountOption[1];
        param.dutyAccount = this.selectAccountOption[2];
      } else {
        this.$message.warning("值班号不能为空");
        return;
      }
      if (this.selectPerson.length > 0) {
        param.dutyPerson = this.selectPerson;
      } else {
        this.$message.warning("值班人不能为空");
        return;
      }
      param.dateInfo = this.selectDates;
      // console.log(JSON.stringify(this.accountOptions));
      http(url.submit, param).then(() => {
        // console.log(data);
        // this.pageData = data;
        this.$router.push({
          path: "/result",
          query: {
            yearMonth: param.yearMonth,
            group: param.group,
            type: param.type,
            dutyAccount: param.dutyAccount,
            startDate: this.fromDate,
            endDate: this.toDate
          }
        });
      });
    },
    // 获取某年某月的所有跨度周的日期，并按照每周进行一组，组成一个二维数组
    getYMWeek(year, month) {
      let list = [],
        d1,
        weekCount,
        weeklist,
        item,
        d = new Date();
      // what day is first day
      d.setFullYear(year, month - 1, 1); //  设置时间为2018-01-01
      let w1 = d.getDay(); //  这天是周几
      if (w1 === 0) w1 = 7; // 1,2,3,4,5,6,7
      // total day of month
      d.setFullYear(year, month, 0); //  设置时间是2018-02-31
      let dd = d.getDate(); // 每个月的总天数
      // console.log(dd);
      // first Monday
      if (w1 !== 1) {
        d1 = 7 - w1 + 2;
        // 跨度上个月的一周日期
        // d.setFullYear(year, month-1, 2-w1); // 周一的日期
        (weeklist = []), (item = {});
        for (let i = 0; i < 7; i++) {
          d.setFullYear(year, month - 1, 2 - w1 + i);
          if (i == 0) {
            // 排班首日的日期
            this.fromDate =
              d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
          }
          item = {
            date:
              d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(),
            status: false,
            day: d.getDate()
          };
          weeklist.push(item);
        }
        list.push({ weekStatus: false, weekList: weeklist });
      } else {
        d1 = 1;
        // 排班首日的日期
        this.fromDate =
          d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      }
      weekCount = Math.ceil((dd - d1 + 1) / 7); // 这个月有多少周
      for (let k = 0; k < weekCount; k += 1) {
        weeklist = [];
        let monday = d1 + k * 7; // 每周周一
        let sunday = monday + 6; // 每周周日
        // let from =year + '-' + month +"-"+ monday;
        item = {};
        let j = 0;
        if (sunday <= dd) {
          // 没有跨月
          for (j = 0; j < 7; j++) {
            item = {
              date: year + "-" + month + "-" + (monday + j),
              status: false,
              day: monday + j
            };
            weeklist.push(item);
            // 排班最后一日的日期
            if (j == 6) {
              this.toDate = item.date;
            }
          }
        } else {
          for (j = 0; j < 7; j++) {
            d.setFullYear(year, month - 1, monday + j);
            item = {
              date:
                d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(),
              status: false,
              day: d.getDate()
            };
            weeklist.push(item);
            // 排班最后一日的日期
            if (j == 6) {
              this.toDate = item.date;
            }
          }
        }
        list.push({ weekStatus: false, weekList: weeklist });
      }
      return list;
    },
    changeDayStatus(weekStatus, dayStatus, weekIndex, dayIndex) {
      this.selectDates[weekIndex].weekList[dayIndex].status = !dayStatus;
      // 检查是否需要更新整周的状态
      // 如果 周状态是 true, 此时修改 日状态从 true 变成 false 则需要更改周状态
      if (weekStatus && dayStatus) {
        this.selectDates[weekIndex].weekStatus = false;
      }
      // 如果周状态是 false , 此时修改 日状态从 false 变成 true ,需要遍历看下是否每天的
      // 状态都变成了 true ,如果是，则需要将 周状态修正为 true
      if (!weekStatus && !dayStatus) {
        let arr = this.selectDates[weekIndex].weekList;
        let changeFlag = true;
        for (let i = 0; i < 7; i++) {
          // 一周七天
          if (!arr[i].status) {
            changeFlag = false;
            break;
          }
        }
        if (changeFlag) {
          this.selectDates[weekIndex].weekStatus = true;
        }
      }
      // console.log(dayIndex);
    },
    changeWeekStatus(weekStatus, weekIndex) {
      this.selectDates[weekIndex].weekStatus = !weekStatus;
      // 遍历将所有的本周内状态更新
      let arr = this.selectDates[weekIndex].weekList;
      for (let i = 0; i < 7; i++) {
        // 一周七天
        arr[i].status = !weekStatus;
      }
      // console.log(weekIndex);
    },
    changeMonth(value) {
      // console.log(value); 2019-11
      // 更新排班的日期
      let checkDate = value.split("-");
      this.selectDates = this.getYMWeek(checkDate[0], checkDate[1]);
      // 切换年月份
    },
    selectAllMonth() {
      // 选择整月，正选和反选
      let weeklength = this.selectDates.length;
      for (let i = 0; i < weeklength; i++) {
        this.selectDates[i].weekStatus = !this.allMonthFlag;
        for (let j = 0; j < 7; j++) {
          // 一周七天
          this.selectDates[i].weekList[j].status = !this.allMonthFlag;
        }
      }
      this.allMonthFlag = !this.allMonthFlag;
    },
    getPersonAndAccount() {
      http(url.getPersonAndAccount).then(data => {
        // console.log(data);
        // 转换数据结构，初始化所有的值班人和值班号选择列表
        // this.selectPersons  this.accountOptions
        let groupItem = {};
        let typeItem1 = {}; // 早班 或 全天
        let typeItem2 = {}; // 晚班
        let accountItem = {};
        this.personsAndAccountsStorage = [...data];
        data.forEach(item => {
          groupItem = {
            label: item.group,
            value: item.group,
            children: []
          };
          if (item.group == "报警运维") {
            // 报警运维安排白班和晚班
            typeItem1 = {
              label: "早班",
              value: "早班",
              children: []
            };
            typeItem2 = {
              label: "晚班",
              value: "晚班",
              children: []
            };
          } else {
            typeItem1 = {
              label: "全天",
              value: "全天",
              children: []
            };
          }
          item.accounts.forEach(account => {
            accountItem = {
              label: account,
              value: account
            };
            typeItem1.children.push(accountItem);
            if (item.group == "报警运维") {
              typeItem2.children.push(accountItem);
            }
          });
          groupItem.children.push(typeItem1);
          if (item.group == "报警运维") {
            groupItem.children.push(typeItem2);
          }
          this.accountOptions.push(groupItem);
        });
      });
    },
    accountChange(value) {
      // 值班号选择改变值班人的备选项
      this.selectPerson = [];
      this.selectPersons = [];
      if (value.length > 0) {
        let personItem = {};
        this.personsAndAccountsStorage.forEach(item => {
          if (item.group == value[0]) {
            item.persons.forEach(info => {
              personItem = {
                label: info,
                value: info
              };
              this.selectPersons.push(personItem);
            });
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.content-body {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(235, 235, 235);
  border-image: initial;
  border-radius: 3px;
  transition: all 0.2s ease 0s;
  display: block;
  padding: 10px 20px;
}
.content-body > p {
  text-align: left;
}
.grid-content {
  display: inline-block;
  font-size: 14px;
  color: #999;
}
.basic-info-name .el-select {
  min-width: 75px;
}
.el-cascader {
  width: 100%;
}
.cascader-left {
  padding-left: 20px;
}
.all-months {
  text-align: left;
  padding: 10px 0px;
}
.select-day-header {
  text-align: left;
  font-size: 14px;
  font-weight: 900;
}
.grid-line {
  margin-top: 10px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.grid {
  display: inline-block;
  height: 30px;
  line-height: 30px;
}
.bc-green {
  background-color: #67c23a;
  color: white;
}
.circle {
  display: inline-block;
  height: 30px;
  width: 30px;
  border-radius: 30px;
}
.ml-9 {
  margin-left: 9px;
}
.select-day-footer {
  margin-top: 10px;
}
.select-day-footer .el-select {
  width: 200px;
}
</style>
