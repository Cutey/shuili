<template>
  <div class="mapToolBar">
   
    <!-- 选中的地图类型展示框 -->
    <el-button :title="activetitle" v-show="!boxshow" class="map-tool-bar-btnimg isactivebtn" :class="activeclass"  @click="boxshow = !boxshow"></el-button>
    <!-- 地图类型切换的动画 -->
    <transition enter-active-class="animate__animated animate__bounceInRight" leave-active-class="animate__animated animate__bounceOutRight" :duration="{enter:1000, leave:500}">   <!--这里的name 和 css 类名第一个字段要一样-->
      <div v-show="boxshow" style="margin-left:10px">
        <el-button title="卫星图" class="map-tool-bar-btnimg full-btnimg" :class="activelyrType == 'img' ? 'isactivebtn' : 'noactivebtn'"  @click="switchBaseLyr('img','full-btnimg','卫星图')"></el-button>
        <el-button title="矢量图" class="map-tool-bar-btnimg full-btnvec" :class="activelyrType == 'vec' ? 'isactivebtn' : 'noactivebtn'"  @click="switchBaseLyr('vec','full-btnvec','矢量图')"></el-button>
        <el-button title="地形图" class="map-tool-bar-btnimg full-btnter" :class="activelyrType == 'ter' ? 'isactivebtn' : 'noactivebtn'"   @click="switchBaseLyr('ter','full-btnter','地形图')"></el-button>
      </div>
    </transition>
  </div>
</template>

<script>
import mapUtil from "@/utils/Openlayer-utils";
import screenfull from "screenfull";
export default {
  name:"mapToolBar",
  data(){
    return{
      activelyrType:'img',
      boxshow:false,
      activeclass:"full-btnimg",
      activetitle:"卫星图"
    }
  },
  mounted(){
    this.$nextTick(() =>{

    });
  },
  methods:{
   
    // 底图切换
    switchBaseLyr(lyrType,calssstr,activetitle){
      this.activelyrType = lyrType
      this.activeclass = calssstr
      this.activetitle = activetitle
      this.boxshow = false
      mapUtil.switchLayer(lyrType)
      mapUtil.MousePosition()
    }
  }
}
</script>

<style scoped>
.mapToolBar{
  position: absolute;
  z-index: 7;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background: rgba(6,30,62,.7);
  border-radius: 6px;
}
.map-tool-bar-btn{
  font-size: 24px;
  padding: 5px;
  background: rgba(200,194,188,.6);
  border: 2px solid #0EB9EA;
  border-radius: 5px;
  color: #fff;
  width: 38px;
  height: 38px;
}
.map-tool-bar-btnimg{
  padding: 5px;
  background: rgba(200,194,188,.6);
  /* border: 2px solid #0EB9EA; */
  border-radius: 5px;
  color: #fff;
  width: 38px;
  height: 38px;
}
.isactivebtn{
   border: 2px solid #ED6C0C;
}
.noactivebtn{
  border: 2px solid #0EB9EA;
}
.full-btn{
  
}
.full-btnimg{
  background: url('../../../assets/image/mapbtn/image.png') no-repeat;
  background-size: cover;
}
.full-btnvec{
  background: url('../../../assets/image/mapbtn/vector.png') no-repeat;
  background-size: cover;
}
.full-btnter{
  background: url('../../../assets/image/mapbtn/terrain.png') no-repeat;
  background-size: cover; 
}
</style>
