<template>
  <div>
    <div class="total">
      <div class="container">
        <div class="imgbox" style="float: left;;">
          <img :src="useinfo.avatar_url" alt="" class="imgbox">
        </div>
        <div class="textbox">
            <!-- <img :src="useinfo.avatar_url" alt="" class="imgbox"> -->
          <p>
            <span>{{useinfo.name}}</span>
            <!-- {{useinfo}} -->
          </p>
          <p>
            <span>考勤组：</span>
            <span >{{groupName}}</span>
          </p>
        
        </div>
      </div>
      <div class="class-box" v-if="isShowinfo">
        <p class="class-title">
					<span>上班班次</span>
				
        </p>
        <div class="class-time">
          <div v-for="(item,index) in timeList" :key="item.id" class="node" :class="{nodeline : index != timeList.length -1, lastLine: index === timeList.length -1 && timeList[timeList.length -1].show}">
            <p class="node-dio-title " :class="{'active':item.show === true}"></p>
            <p class="node-name">
              <span>{{item.name}}</span>
              <span>{{item.time}}</span>
            </p>
            <p class="node-name " v-if="item.punchInfo" :class="stateClass(item.punchInfo.status)">
              <span>打卡时间</span>
              <span >{{item.punchInfo.punchTime}}</span>
              <span >[{{item.punchInfo.status | showSdataText}}]</span><br/>
              <!-- <span class="update" v-if=" index === dataList.data.punchInfos.length-1" @click="upDate()">更新打卡时间</span> -->
              <span class="update" v-if=" index === dataList.data.punchInfos.length-1" @click="upDate()">更新打卡时间</span> 
                                                                                                                                                                                                                                                                                                                
            </p>
            <div class="time-button " v-if="item.show" @click="signBtn(index,timeList)" :class="{'buttonbg': item.isqt ==true }">
              <div class="button-cont">
                <p>
                 
                  <span v-if="item.isqt ==true">签退</span>
                  <span v-if="item.isqt ==false">签到</span>
                </p>
                <p>
                  <span id="mytime">{{nowTime}}</span>
                </p>
              </div>
            </div>
         
            <p :class="{'node-dio-footer': index === timeList.length -1 && timeList[timeList.length -1].show}"></p>
          </div>
        </div>
      </div>
      <div v-if="!isShowinfo">
           <img src="../assets/0.png" alt="" class="placeholder">
      </div>
      <div v-if="isShowDayOff">
           <span class="placeholder">今天休息</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getCurrentUser, ajaxGet, ajaxPost } from "../core/mxApi";
import signData from "../data/sign.json";
export default {
  data() {
    return {
      useinfo: {},
      groupName: "",
      nowTime: "12:00:00",
      dataList: {},
      timeList: [],
      nowTimeFlag: 0,
      isqiantui: false,
      update: 0,
      isShowUpdate: false,
      isShowinfo: true,
      isShowDayOff:false
    };
  },
  created() {
    // vm.initData();
    // vm.time();

    this.getUseInfo();
    
    this.timing()
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
  },
  mounted() {},
  methods: {
    timing(){
       window.setTime=setTimeout(this.timing,1000*60*3)
        console.log("请求")
        this.getinfo();
    },
    getUseInfo() {
      var vm = this;
      getCurrentUser().then(response => {
        vm.useinfo = response;
        // 缓存数据
        var setuseinfo = JSON.stringify(response);
        sessionStorage.setItem("setuseinfo", setuseinfo);
      });
    },

    getinfo() {
      const needItems = {
        needItems: 1
      };
      var vm = this;
      ajaxGet("/api/v2/attendance/state", needItems).then(response => {
        console.log(JSON.stringify(response.data));
        vm.dataList = response.data;
        vm.groupName = response.data.data.groupName;
        vm.isShowinfo = response.data.data.needCheckIn === 1 ? true : false;
        vm.isShowDayOff = response.data.data.isRest ===1 ? true :false;
        vm.time();
        vm.initData(vm.dataList);
      });
    },
    initData(dataList) {
    
      // 缓存数据
      var allData = JSON.stringify(this.dataList);
      sessionStorage.setItem("allData", allData);
      var getAllData = sessionStorage.getItem("allData");
      // this.dataList = signData
      // this.timeListdata = signData.data.items;
      // const { data: { items } } = signData;
      // const { data: { punchInfos } } = signData;
      // alert(signData.data.punchInfos.length)
      this.timeListdata = dataList.items;
      const { data: { items } } = dataList;
      const { data: { punchInfos } } = dataList;
      const result = items.reduce(
        (acc, item) => {
          const startPunchInfo = punchInfos
            ? punchInfos.find(
                p => p.itemSort === item.sort && p.punchType === 0
              )
            : "";
          const endPunchInfo = punchInfos
            ? punchInfos.find(
                p => p.itemSort === item.sort && p.punchType === 1
              )
            : "";
          const showStartButoon = !startPunchInfo && !acc.button;
          const showEndButton =
            !acc.button && !showStartButoon && !endPunchInfo;
          const start = {
            name: item.startTimeName,
            time: item.startTime,
            punchInfo: startPunchInfo,
            show: showStartButoon,
            isqt: showEndButton
          };
          const end = {
            name: item.endTimeName,
            time: item.endTime,
            punchInfo: endPunchInfo,
            show: showEndButton,
            isqt: showEndButton
          };
          return {
            result: [...acc.result, start, end],
            button: showStartButoon || showEndButton
          };
        },
        { result: [], button: false }
      ).result;
      console.log("列表---->>");
      console.log(JSON.stringify(result));
      this.timeList = result;

      var vm = this;
    },
    time() {
      var vm = this;
      var timestamp = vm.dataList.data.timestamp; //服务器时间
      // var timestamp = 1526878920; //1526777086 1526780676  1526878920
      console.log(timestamp);
      setInterval(function() {
        timestamp += 1;
        vm.nowTimeFlag = timestamp;
        vm.nowTime = vm.timestampToTime(vm.nowTimeFlag).split(" ")[2];
        vm.nowTime2 = vm.timestampToTime(vm.nowTimeFlag);
        vm.nowdate = vm.timestampToTime(vm.nowTimeFlag).split(" ")[0];
      }, 1000);
    },
    timestampToTime(nowTimeFlag) {
      var date = new Date(nowTimeFlag * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      var vm = this;
      return (
        Y +
        M +
        D +
        " " +
        vm.distime(h) +
        ":" +
        vm.distime(m) +
        ":" +
        vm.distime(s)
      );
    },
    distime(n) {
      return n >= 10 ? n : "0" + n;
    },
    signBtn(index, list) {
      //打卡请求
      const place = this.dataList.data.place;
      const wifiInfo = this.dataList.data.wifiInfo;
      const punch = {
        longitude: place.lon,
        latitude: place.lat,
        wifiMacAddress: wifiInfo.macAddress
      };
      alert(JSON.stringify(punch));
      var vm = this;
      ajaxPost("/api/v2/attendance/punch", punch)
        .then(response => {
          alert(response.data.msg);
        })
        .then(function() {
          vm.getinfo();
        }).catch(error=>{
           console.log(error.errors.message)
        })
    },
    //更新打卡时间
    upDate() {
      const place = this.dataList.data.place;
      const wifiInfo = this.dataList.data.wifiInfo;
      const punch = {
        longitude: place.lon ? place.lon : "",
        latitude: place.lat ? place.lat : "",
        wifiMacAddress: wifiInfo.macAddress ? wifiInfo.macAddress : ""
      };
      //  alert(JSON.stringify(punch));
      var vm = this;
      ajaxPost("/api/v2/attendance/punch/update/time", punch)
        .then(response => {
          alert(JSON.stringify(response.data.msg));
        })
        .then(function() {
          vm.getinfo();
        }).catch(error=>{
           console.log(error.errors.message)
        })
    },
    stateClass(status) {
      if (status == 1) {
        return "normal";
      } else if(status === 5){
         return "Absent";
      } else{
         return 'abnormality'
      }
      
    }
  },
 
  destroyed() {
    clearInterval(window.setTime);
  }

};
</script>
<style scoped>
ul > li {
  list-style: none;
}

.total {
  margin: 10px 10px;
}

.center {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}

.button {
  outline: none;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  background: #5078ac;
  color: #ffffff;
  cursor: pointer;
}

.container {
  width: 100%;
  margin: 5px 0px;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 5px;
}

.container:after {
  display: block;
  content: "";
  width: 0;
  clear: both;
}

.container img {
  width: 50px;
  height: 50px;
  border: 1px solid #cccccc;
  border-radius: 50%;
  float: left;
  margin: 5px 10px;
}

.textbox {
  float: left;
  margin: 10px 5px;
}

.textbox p:nth-child(2) {
  color: #cccccc;
}

.class-box {
  padding-left: 10px;
  margin-bottom: 100px;
}

.time-button {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  /* background: #efb24d; */
  background: url("../assets/0.png") no-repeat;
  background-position: center;
  position: relative;
  left: 50%;
  top: -20px;
  transform: translate(-50%);
  cursor: pointer;
}

.buttonbg {
  background: url("../assets/1.png") no-repeat;
  background-position: center;
}

.button-cont {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
}

.button-cont p:nth-child(1) {
  font-size: 30px;
  margin-left: 5px;
  margin-top: -10px;
  margin-bottom: 10px;
}

.button-cont p:nth-child(2) {
  font-size: 18px;
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
.placeholder{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
