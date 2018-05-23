<template>
    <div >
        <div class="wrap">
           <div class="title">
                <ul>
                     <li v-for='(item , index) in list'  @click="goPath(item.path)" :key="index" :class='{active:url==item.path}' >{{item.title}}</li>
                </ul>
           </div>
        </div>
        <router-view/>
       
    </div>
</template>
<script>
 
export default {
  data() {
    return {
      list: [
        { title: "打卡", path: "/Sign" },
        { title: "统计", path: "/SignList"},
        { title: "打卡规则", path: "/Rule"}
      ]
    };
  },
  created() {
    this.url = this.$route.path;
    console.log(this.url);
  },
  mounted() {},

  methods: {
    goPath(path) {
      this.$router.replace(path);
      this.url = this.$route.path;
    }
  }
};
</script>
<style  scoped>

.title {
  background-color: #eff6f7;
  text-align: center;
  position: fixed;
  
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999

}
.title > ul{
 width:100%;

}
.title > ul > li {
  width:33%;
  display: block;
  float:left;
  font-size: 16px;
  line-height: 60px;
  list-style: none;
}
li.active {
  background-color: #5078ac;
  color: #ffffff;

}
</style>






