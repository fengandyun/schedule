<template>
  <div class="content">
    <div class="content-body">
      <p class="left">信息查询</p>
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
                v-model="selectAccountOption"
              ></el-cascader>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="search-content"> 
        <el-button type="primary" @click="search" class="search-btn">查询</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { http, url } from "../libs/http";

export default {
  name: "search",
  data() {
    return {
      selectMonth: "", // 默认选中当前月
      selectAccountOption: [], // 选中的值班号,单选
      accountOptions: [], // 值班号多级选择
      selectMonths: [], // 当前可选的月份
      fromDate: "", // 月份开始日期
      toDate: "", // 月份结束日期
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
      nextYear = currentYear - 1;
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
    this.getPersonAndAccount(); // 获取所有值班号
    this.selectDates = this.getYMWeek(currentYear, currentMonth);
  },
  methods: {
    search() {
      // 提交排班信息
      // 整理提交数据的param
      let param = {
        yearMonth: this.selectMonth,
        group: "",
        type: "",
        dutyAccount: "",
        startDate: this.fromDate,
        endDate: this.toDate
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
      this.$router.push({
        path: "/result",
        query: param
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
    changeMonth(value) {
      // console.log(value); 2019-11
      // 更新排班的日期
      let checkDate = value.split("-");
      this.selectDates = this.getYMWeek(checkDate[0], checkDate[1]);
      // 切换年月份
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
        // debugger
        this.personsAndAccountsStorage = [...data];
        data.forEach((item) => {
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
          item.accounts.forEach((account) => {
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
  }
};
</script>
<style scoped>
.content-body {
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
.search-content {
  padding: 20px 0px;
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
.search-content button {
  width: 150px;
}
.basic-info {
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
.ml-9 {
  margin-left: 9px;
}
</style>

