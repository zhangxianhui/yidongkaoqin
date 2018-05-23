<template>
  
   <div>
    <div class="total" >
        <div v-if="isShowInfo">
            <div class="container" >
                <div class="imgbox" style="float: left;;">
                <img :src="useinfo.avatar_url" alt="" class="imgbox">
                </div>
                <div class="textbox">
                    <!-- <img :src="useinfo.avatar_url" alt="" class="imgbox"> -->
                <p>
                    <span>{{useinfo.name}}</span>
                </p>
                <p>
                    <span>考勤组：</span>
                    <span >{{form.groupName.groupName}}</span>
                </p>
                </div>
            </div>
            <div class="title-text" >
                <div class="">
                    <h4>1.当前考勤组名称</h4>
                    <P>{{form.groupName.groupName}}</P>
                </div>
                <div >
                    <h4>2.考勤地点</h4>
                    <div id="container" style="width:350px; height:200px; margin:10px 0;" class="mymap"></div>
                    <p>考勤地点:<span>{{form.place.address}}</span></p>
                    <p>有效范围:{{form.place.range}}米</p>
                </div>
                <div >
                    <h4>3.wifi信息</h4>
                    <P>
                    <span>wifi名称</span>：
                    <span>{{form.wifiInfo.wifiName}}</span>
                    </P>
                    <P>
                    <span>MAC地址</span>：
                    <span>{{form.wifiInfo.macAddress}}</span>
                    </P>
                </div>
            </div>
        </div>
        <div v-if="!isShowInfo ">
            <img src="../assets/0.png" alt="" class="placeholder">
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        place: {
          lon:0,
          lat: 0,
          range: 0,
          fillOpacity:0,
          strokeWeight: 0,
          address: ""
        },
        wifiInfo: {
          macAddress: "",
          wifiName: ""
        },
        groupName: {
          groupName: ""
        }
      },
      useinfo: {},
      isShowInfo: true,
      isShowPlaceholder: false
    };
  },
  created(){
    this.getUseInfo();
    this.getCoord();
   
  },
  mounted() {
    this.loadJScript();
    this.loadmap(); //加载地图和相关组件
  
  },
  methods: {
    loadJScript() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "http://webapi.amap.com/maps?v=1.4.6&key=092bba2aa4c9b7ef30a7088ce7051061&plugin=AMap.Geocoder";
      document.body.appendChild(script);
    },
    loadmap() {
      var vm = this;
      const map = new AMap.Map("container", {
        zoom: 9
      });
      var marker = new AMap.Marker({
        map: map,
        position: [vm.form.place.lon, vm.form.place.lat]
      });
      var circle = new AMap.Circle({
        center: [vm.form.place.lon, vm.form.place.lat],
        radius: vm.form.place.range,
        fillOpacity: vm.form.place.fillOpacity,
        strokeWeight: vm.form.place.strokeWeight
      });
      circle.setMap(map);
      map.setFitView();
    },
    getUseInfo() {
        var resultUseInfo= sessionStorage.getItem("setuseinfo");
     this.useinfo = JSON.parse(resultUseInfo);
      console.log("1")
      console.log(JSON.stringify(resultUseInfo));
    },
    getCoord() {
      var getAllData = sessionStorage.getItem("allData");
      var resultData = JSON.parse(getAllData);
       console.log("2")
      console.log(JSON.stringify(resultData.data.place));
      this.isShowInfo = resultData.data.needCheckIn === 1 ? true : false;

      const lon = resultData.data.place.lon ? resultData.data.place.lon : 0;
      const lat = resultData.data.place.lat ? resultData.data.place.lat : 0;
      const range = resultData.data.place.range
        ? resultData.data.place.range
        : 0;
      const fillOpacity = 0.2;
      const strokeWeight = 1;
      const address = resultData.data.place.address
        ? resultData.data.place.address
        : "";
      const macAddress = resultData.data.wifiInfo.macAddress
        ? resultData.data.wifiInfo.macAddress
        : "";
      const wifiName = resultData.data.wifiInfo.wifiName
        ? resultData.data.wifiInfo.wifiName
        : "";
      const groupName = resultData.data.groupName;
      this.form.place = {
        lat,
        lon,
        range,
        fillOpacity,
        strokeWeight,
        address
      },
        this.form.wifiInfo = {
          macAddress,
          wifiName
        };
      this.form.groupName = {
        groupName
      };
    }
  }
};
</script>
<style scoped>
.mymap {
  width: 300px;
  height: 300px;
}
ul > li {
  list-style: none;
}

.total {
  margin: 10px 20px;
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

.title-text {
  margin-left: 5px;
}

.title-text > div {
  margin: 10px 0px;
}

p {
  color: #cccccc;
}
.placeholder {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>