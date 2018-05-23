<template>
    <div class="wrap" >
        <div v-if="isShowDate">
            <div class="data-cale">
                <Calendar ref="Calendar" v-on:choseDay="clickDay" v-on:changeMonth="changeDate" :markDate=arr ></Calendar>
            </div>
            <div class="data-time">
                <div class="class-box" >
                    <div class="class-time" v-if="isShowList">
                        <div v-for="(item,index) in timeList" :key="item.id"   class="node" :class="{nodeline : index != timeList.length -1}">
                            <p class="node-dio-title " :class="{'active':item.show}"></p>
                            <p class="node-name">
                                <span>{{item.name}}</span>
                                <span>{{item.time}}</span>
                            </p>
                            <p class="node-name " v-if="item.infos" :class="statusClass(item.infos.status)">
                                <span>打卡时间</span>
                                <span >{{item.infos.punchTime}}</span>
                                <span >[{{item.infos.status | showSdataText}}]</span><br/>
                                <span class="update" v-if=" item.infos.canApproval === 1" @click="apply(item.infos.sort,item.infos.type)">申请补卡</span>                                                                                                                                                                                                                                                                                                 
                            </p>
                            <!-- <p :class="{'node-dio-footer': index === timeList.length -1 && timeList[timeList.length -1].show}"></p> -->
                        </div>
                    </div>
                    <div class="class-time text" v-if="!isShowList">
                        <span class="placeholder">暂无考勤记录</span>
                    </div>
                
                </div>
        
             </div>

        </div>
         <!-- <div v-if="!isShowDate">
            <span class="placeholder">小络同学开小差了，请稍后</span>
        </div> -->
        <div v-if="!isShowDate">
            <img src="../assets/0.png" alt="" class="placeholder">
        </div>
    </div>
  
</template>
<script>
import Calendar from "vue-calendar-component";
import { getCurrentUser, ajaxGet, ajaxPost } from "../core/mxApi";
import signData from "../data/sign.json";
export default {
  components: {
    Calendar
  },
  data() {
    return {
      arr: [],
      timeList: [],
      isShowList: true,
      isShowDate: true,
      isShowPlaceholder:false

    };
  },
  created() {
    const date = this.getNowFormatDate();
    const resultdate = this.disDateArr(date);
    this.arr.push(date);
     console.log("1111")
    console.log(resultdate)
     this.getinfo(resultdate);
  },
  methods: {
    disDateArr(date) {
      const arrdate = date.split("/")[0];
      const y = date.split("/")[0];
      const m = date.split("/")[1];
      const d = date.split("/")[2];
      const resultdate = y + "-" + this.disdate(m) + "-" + this.disdate(d);
      return resultdate;
      console.log(resultdate);
      // this.getinfo(resultdate);
    },
    disdate(n) {
      return n >= 10 ? n : "0" + n;
    },
    clickDay(data) {
      const resultdate = this.disDateArr(data);
      this.getinfo(resultdate);
    },
    changeDate(data) {
      console.log(data); //左右点击切换月份
    },

    goReissue() {
      // this.$router.push("/vueline");
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "/";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;

      return currentdate;
    },
    getinfo(date) {
      const data = {
        date
      };
      console.log(JSON.stringify(data));
      var vm = this;
      ajaxGet("/api/v2/attendance/history", data).then(response => {
        console.log("考勤记录");
        console.log(JSON.stringify(response.data));
        //  alert(JSON.stringify(response.data))
        console.log(response.data.data.needCheckIn);
        vm.isShowDate = response.data.data.needCheckIn === 1 ? true : false;
        if(response.data.data.needCheckIn === 1&&response.data.data.infos.length === 0){
             vm.isShowList = false
        }else{
             vm.isShowList = true
        }
        vm.dataList = response.data;
        vm.initData(vm.dataList);
      });
    },
    initData(dataList) {
      //  this.dataList = signData
      //   this.timeListdata = signData.data.items;
      //   const { data: { items } } = signData;
      //   const { data: { punchInfos } } = signData;
      // alert(signData.data.punchInfos.length)
      this.timeListdata = dataList.items;
      const { data: { items } } = dataList;
      const { data: { infos } } = dataList;
      const result = items.reduce(
        (acc, item) => {
          const startInfo = infos
            ? infos.find(p => p.sort === item.sort && p.type === 0)
            : "";
          const endInfo = infos
            ? infos.find(p => p.sort === item.sort && p.type === 1)
            : "";

          const showStartButoon = !startInfo && !acc.button;
          const showEndButton = !acc.button && !showStartButoon && !endInfo;
          const start = {
            name: item.startTimeName,
            time: item.startTime,
            infos: startInfo,
            show: showStartButoon
          };
          const end = {
            name: item.endTimeName,
            time: item.endTime,
            infos: endInfo,
            show: showEndButton
          };
          return {
            result: [...acc.result, start, end],
            button: showStartButoon || showEndButton
          };
        },
        { result: [], button: false }
      ).result;
      console.log("操作后的数据------》》》", result);
      this.timeList = result;
      console.log(JSON.stringify(this.timeList));
      var vm = this;
    },
    //申请补卡
    apply(sort, type) {
      const nowDate = this.getNowFormatDate();
      const date = this.disDateArr(nowDate);
      const data = {
        sort,
        type,
        date
      };
      console.log(JSON.stringify(data));
      // ajaxPost("/api/v2/attendance/approval", data)
      //   .then(response => {
      //     alert(JSON.stringify(response.msg));
      //   })
      // .then(function() {
      //   vm.getinfo();
      // });
    },
    statusClass(status) {
      if (status == 1) {
        return "normal";
      } else if (status === 5) {
        return "Absent";
      } else {
        return "abnormality";
      }
    }
  },
  filters: {
    showSdataText(v) {
      if (v == 1) {
        return "正常";
      }
      if (v == 2) {
        return "迟到";
      }
      if (v == 3) {
        return "早退";
      }
      if (v == 4) {
        return "旷工";
      }
      if (v == 5) {
        return "缺卡";
      }
    }
  }
};
</script>
<style scoped>
.wrap {
  background: #ccc;
}

a {
  text-decoration: none;
}

.data-cale >>> .wh_jiantou1 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #000;
  border-left: 2px solid #000;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  position: absolute;
  left: 60px;
}

.data-cale >>> .wh_jiantou2 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #000;
  border-right: 2px solid #000;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  /* margin-left: -105px; */
  position: absolute;
  right: 60px;
}

.data-cale >>> .wh_top_changge li {
  padding: 0px 0px;
}

.data-cale >>> .wh_content_item {
  font-size: 15px;
  width: 13.4%;
  padding-bottom: 10.14%;
  text-align: center;
  color: #000;
  position: relative;
}

.data-cale >>> .wh_content_item div .wh_isToday {
  margin: auto;
  background-color: #2572c0;
  color: #fff;
  border-radius: 100px;
  text-align: center;
}

/* .data-cale >>> .wh_content_item li:hover {
    background: #71b4c7e0;
    cursor: pointer;
} */

.data-cale >>> .wh_top_changge li {
  cursor: pointer;
  color: #000;
  font-size: 18px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 47px;
}

.data-cale >>> .wh_content_all {
  font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue,
    STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
  background-color: #fff;
  width: 100%;
  overflow: hidden;
  padding-bottom: 8px;
}
.data-cale >>> .wh_content_item div .wh_isMark {
  margin: auto;
  border-radius: 100px;
  background: #96aec7;
  z-index: 2;
  color: #fff;
}
.data-cale >>> .wh_content_item div .wh_isMark {
  margin: auto;
  border-radius: 100px;
  border: none;
  z-index: 2;
}

.data-time > div {
  background: #fff;
  margin: 2px 0;
  padding: 20px 25px;
}

.data-item div {
  padding: 10px 0;
}
.data-item span {
  display: inline-block;
  background: #17c296;
  padding: 5px 10px;
  border-radius: 20px;
  color: #fff;
  margin-top: 5px;
}
.submit {
  outline: none;
  border: none;
  background: none;
  font-size: 18px;
  display: inline-block;
  position: absolute;
  right: 20px;
  color: #377ec5;
}
.lack span {
  background: #f5a623;
}

.class-time {
  margin-top: 30px;
}

.class-title {
  margin: 20px 0 30px 0;
}

.nodeline {
  border-left: 3px solid #cccccc;
}

.lastLine {
  border-left: 3px solid #cccccc;
}

.node {
  margin: 0 20px;
  margin-top: -20px;
  min-height: 150px;
  position: relative;
}

.node-dio-title,
.node-dio-footer {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #cccccc;
  margin-left: -11px;
}

.active {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #89a2c9;
  margin-left: -11px;
}

.node-dio-footer {
  position: absolute;
  bottom: 0px;
}

.node-dio-title {
  position: absolute;
  top: 0px;
}
.update {
  cursor: pointer;
  color: rgb(127, 214, 255);
}
.node-name {
  margin: -22px 0 22px 20px;
}
.normal {
  color: #17c296;
}
.abnormality {
  color: #ff5252;
}
.Absent {
  color: #f5a623;
}
.text{
    position: relative;
    margin-top:30%;
}
.placeholder {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
