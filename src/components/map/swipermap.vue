<template>
  <div style="height: 100%;position: relative;">
    <div id="mapadee" class="map"></div>
    <input id="swipe" type="range" style="width: 100%;width: 100%;position: absolute;bottom: 10px;z-index: 9;" />
    <i class="el-icon-close closefonts" @click="closeClick"></i>
  </div>
</template>

<script>
import swipe from "@/utils/maplayerSwipe";
export default {
name:'mapserver',
  data() {
    return {
      currentMap: null
    };
  },
  mounted() {
     this.$nextTick(()=>{
        this.init();
    });
  },
  methods: {
    //   初始化卷帘地图
    init() {
      swipe.init("mapadee");
      swipe.mapSwipe();
      swipe.addlayers()
    },
    // 关闭卷帘的按钮
    closeClick(){
        this.$store.dispatch('setisjuan',false)
    }
  }
};
</script>

<style>
#mapadee {
  width: 100%;
  height: 100%;
}
.closefonts{
    background: rgba(6,30,62,.8);
    border-radius: 6px;
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9;
    font-size: 25px;
    color: #fff;
    cursor: pointer;
}
.closefonts:hover{
    color:#D74B0C ;
}
</style>