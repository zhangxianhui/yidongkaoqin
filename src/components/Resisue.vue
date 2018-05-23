<template>
  <div id='id'>
    <div>
      <!-- <group class="group-title">
        <p><span>补卡班次名称</span><span class="props-span">午休开始时间</span></p>
      </group>
      <group>
        <datetime title="开始时间" v-model="value2"></datetime>
      </group> -->

      
    </div>
  </div>
</template>

<script>
  import {
    Group,
    Datetime,

  } from "vux";
  export default {
    components: {

      Group,
      Datetime,

    },
    data() {
      return {
        value2: ''
      }
    },
    created() {
      document.addEventListener("deviceready", onDeviceReady, false);

      function onDeviceReady() {
        MXWebui.setWebViewTitle("申请补卡");
      }

    },

  }

</script>

<style scoped>
  a {
    text-decoration: none;
  }
.group-title p{
    padding: 10px 15px;
}
.props-span{
    position: absolute;
    right: 30px;
}
</style>
