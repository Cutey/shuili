<template>
<!-- 地图工具组建 -->
    <div class="maptool-warp">
        <ul class="maptool-btns">
            <li class="maptool-btns-one">
                <i class="fa fa-dropbox faicons" title="工具箱" @click="maptoolClick('box')"></i>
            </li>
            <li  class="maptool-btns-one" style="margin-top:10px">
                 <i title="复位" class="el-icon-aim faicons" @click="restore"></i>
            </li>
            <li  class="maptool-btns-one" style="margin-top:10px">
                 <i title="全屏" class="el-icon-full-screen faicons" @click="full"></i>
             </li>
            

            <li class="maptool-btns-one" style="margin-top:10px"  v-show="affix">
                <i class="iconfont icon-shanchu2 faicons" title="清空图层" @click="clearmaplayers"></i>
            </li>

            
            <li class="maptool-btns-one" style="margin-top:10px"  v-show="!affix">
                <i class="iconfont icon-shanchu2 faicons" title="清空图层" @click="clearmapserver"></i>
            </li>

             <li class="maptool-btns-one" style="margin-top:10px" v-show="affix">
                <i class="iconfont icon-D1 faicons" title="三维" @click="thrermap"></i>
            </li>

             <li class="maptool-btns-one" style="margin-top:10px"  v-show="affix">
                <i class="fa fa-server faicons" title="服务管理" @click="showlendmap"></i>
            </li>
        </ul>

        <transition enter-active-class="animate__animated animate__bounceInRight" leave-active-class="animate__animated animate__bounceOutRight" :duration="{enter:1000, leave:500}">   <!--这里的name 和 css 类名第一个字段要一样-->
            <div v-show="boxshow" style="" class="sonbtns">
                <el-button title="测距" class="map-tool-bar-btnimg iconfont icon-map-ruler faicons" :class="activeType == 'LineString' ? 'isactivebtn' : 'noactivebtn'"  @click="switchBaseLyr('LineString')"></el-button>
                <el-button title="侧面" class="map-tool-bar-btnimg iconfont icon-cemian faicons" :class="activeType == 'Polygon' ? 'isactivebtn' : 'noactivebtn'"  @click="switchBaseLyr('Polygon')"></el-button>
                <el-button  v-show="affix" title="卷帘" class="map-tool-bar-btnimg iconfont icon-ditujuanlian faicons" :class="activeType == 'jlmap' ? 'isactivebtn' : 'noactivebtn'"  @click="mapSwipe('jlmap')"></el-button>
                <el-button title="截图" class="map-tool-bar-btnimg iconfont icon-jietu faicons" :class="activeType == 'jt' ? 'isactivebtn' : 'noactivebtn'"  @click="mapjietu('jt')"></el-button>
            </div>
        </transition>
    </div>
</template>

<script>
import mapUtil from "@/utils/Openlayer-utils";
import Measure from '@/utils/measure'
import drawMap from '@/utils/Drawmap'
import html2canvas from "html2canvas";
import screenfull from "screenfull";
import { getToken } from '@/utils/auth'
export default {
    name:'maptool',
    data(){
        return{
            activebtn:null,
            activeType:'',
            boxshow:false,
            imgUrl: null, //截图地址
            affix:true,
        }
    },
    mounted(){
        this.affix = this.$route.meta.affix
    },
    methods:{
        maptoolClick(str){
            if(str == 'box'){ //工具箱点击事件
                this.boxshow = !this.boxshow
            }
        },
        // 地图工具点击事件
        switchBaseLyr(type){
            this.clearmaplayers()
            this.activeType = type
            Measure.measure(mapUtil._mapInstance,type)
        },
        // 清空图层
        clearmaplayers(){
            this.activeType = ''
            Measure.removrhelpTooltip(mapUtil._mapInstance)
            let isclear = !this.$store.state.menuData.isclearmap
            this.$store.dispatch('setisclearmap',isclear)
            this.$store.state.menuData.layersnamelist = []
        },
        // 服务展示模块的清空图层
        clearmapserver(){

        },
        // 地图卷帘
        mapSwipe(type){
              this.activeType = type
              this.$store.dispatch('setisjuan',true)
        },
        // 截图
        mapjietu(type){
            //  this.activeType = type
             mapUtil.drawMap(mapUtil._mapInstance,'sadokfs')
            },
       
        // 复位
        restore(){
            mapUtil.restoreView();
        },
        // 全屏
        full(){
            if (!screenfull.enabled) {
                this.$message({
                message: "you browser can not work",
                type: "warning"
                });
                return false;
            }
            screenfull.toggle();
        },
        // 三维跳转
        thrermap(){
            let url=process.env.VUE_APP_WEBPATH+'?;casoauth='+getToken()
            window.open(url)
        },
        // 服务管理跳转
        showlendmap(){
           this.$router.push('/severlist')
        }
  
    }
}
</script>

<style scoped>
.maptool-warp{
    position: absolute;
    right: 10px;
    bottom: 350px;
    width: 55px;
    height: auto;
    z-index: 0;
    padding: 5px;
    /* border: 1px solid springgreen; */
    text-align: center;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgba(6,30,62,.7);
    border-radius: 6px;
    padding: 15px 0;
}
.maptool-warp-name{
    position: relative;
    width: 100%;
    margin-bottom: 10px;
    height: 40px;
    background: rgba(136,143,144,.6);
    display: flex;
    align-items: center;
    justify-content: center;
}
.maptool-warp-row{
    display: flex;
    justify-content: center;
    font-size: 14px;
    color: #fff;
}
.maptool-warp-row>i{
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
    cursor: pointer;
    color: aqua;
}
.maptool-btns{
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}
.maptool-btns>li{
    font-size: 24px;
    padding: 5px;
    background: rgba(200,194,188,.6);
    border: 2px solid #0EB9EA;
    border-radius: 5px;
    color: #fff;
    width: 38px;
    height: 38px;
}
.faicons{
    color: #fff;
    font-size: 24px;
    cursor: pointer;
    
}
.sonbtns{
    margin-top: 15px;
    position: absolute;
    right: 90px;
    top: 0;
    display: flex;
}
</style>

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