<template>
  <div class="server-warp">
    <!-- 地图组建 -->
    <mapInstance />
    <!-- 模块切换 -->
    <transition enter-active-class="animate__animated animate__slideInRight" leave-active-class="animate__animated animate__slideOutRight" :duration="{enter:3000, leave:3000}">
        <div class="dmdzcomend" style="" v-show="mpoudshowmoudle">
            <div class="dmdzcomend-header">
                <span> <i class="fa fa-window-close closeicon" @click="detailsclose"></i></span>

                <span class="lpgosamn">{{moudelvalue.title}}
                    <i :class="moudelvalue.icon" style='margin-left:5px;font-size:25px'></i>
                </span>
            </div>

            <div class="dmdzcomend-warp" style="height:360px;overflow-y: auto;" v-show="showserverkey=='xqzs'">
                <xqzscomend  :detailsrow='serverrow'/>
            </div>

            <div v-show="showserverkey=='tcsz'" style="height: 200px;padding: 0px 10px;">
                 <div class="featurestyle" v-show="serverrow">
                        <div style="width:100%" class="mapstyles">
                            <span >透明度</span>
                            <slider  @input='inputchange' :datarow='serverrow' :min=0 :max=100 :value=100  v-model = "serverrow.pernum"  v-if="serverrow.slidershow"></slider>
                        </div>

                        <div style="width:100%;" class="mapstyles">
                             <span>边框颜色</span>
                             <el-color-picker
                                v-model="serverrow.stroke"
                                show-alpha
                                :predefine="predefineColors"
                                @change='mapcolorchange(serverrow.stroke,serverrow,"stroke")'
                                >
                            </el-color-picker>
                        </div>

                        <div style="width:100%;" class="mapstyles">
                             <span>填充颜色</span>
                             <el-color-picker
                                v-model="serverrow.fill"
                                show-alpha
                                :predefine="predefineColors"
                                @change='mapcolorchange(serverrow.fill,serverrow,"fill")'
                                >
                            </el-color-picker>
                        </div>

                        <div style="width:100%;margin-top:10px" class="mapstyles"> 
                             <span style="margin-right:5px;width:50px">线宽</span>
                             <el-input-number v-if="serverrow.style" v-model="serverrow.style.line" size="mini" @change="handleChange(serverrow.style.line,serverrow)" :min="1" :max="12"></el-input-number>
                        </div>
                    </div>
            </div>
        </div>
             
    </transition>
  </div>
</template>

<script>
import mapInstance from "@/components/map/mapInstance";
import xqzscomend from './comend/xqzscomend'
import slider from '@/components/slider/index'
import mapUtil from "@/utils/Openlayer-utils";
import { getserver } from "@/api/mapserver/index.js";
import newserverlist from '../../../public/data/server.json'
export default {
  name: "servermap",
  components: {
    mapInstance,xqzscomend,slider
  },
  data() {
    return {
      serverid: "", //路由传参过来的请求服务的id
      serverrow: {
          stroke:'',
          slider:false
      }, //返回的服务对象
      moudelvalue:'',//左侧模块切换绑定值
      mpoudshowmoudle:false,//模块展示与否的绑定值
      rowfeature:null,
      btnstype: [
                {
                title: "详情展示",
                icon: "fa fa-credit-card",
                key: "xqzs"
                },
                {
                title: "图例展示",
                icon: "fa fa-sitemap",
                key: "tlzs"
                },
                {
                title: "图层设置",
                icon: "fa fa-cog",
                key: "tcsz"
                }
            ],
            predefineColors: [
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255, 69, 0, 0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577'
            ],
    };
  },
   computed:{
        showmoudle(){
            return this.$store.state.menuData.showmoudle;
        },
        showserverkey(){
            return this.$store.state.menuData.showserverkey;
        }
    },
    watch:{
        showmoudle(newvla,oldval){
            this.mpoudshowmoudle = newvla
        },
        showserverkey(newvla,oldval){
            for(var i=0;i<this.btnstype.length;i++){
                if(newvla==this.btnstype[i].key){
                    this.moudelvalue = this.btnstype[i]
                    if(newvla=='tcsz'){
                        this.serverrow.slidershow = true
                    }
                }
            }
        },
      
    },
  mounted() {
    this.serverid = this.$route.params.id;
   
    if( this.serverid == undefined){
        this.replyclick()
    }else{
        this.$nextTick(()=>{
            this.getserver()
            // this.addmapserver(this.serverrow )
        });
    }
  },
  methods: {
    //   获取地图属性详情
    getserver() {
      getserver(this.serverid).then(res => {
        if(res.msg== "操作成功"){
            this.serverrow = res.data
            this.addmapserver(this.serverrow )
        }
      });
    },
    // 返回事件
    replyclick() {
      this.$router.push("/severlist");
    },
      // 关闭按钮
    detailsclose(){
         this.$store.dispatch('setshowmoudle',false)
    },
    addmapserver(row){
       
            mapUtil.clearLayer('WVTservermap')
            let url= row.serverUrl
            this.rowfeature = null
            let name = "WVTservermap"
            let leaver = 1
            let leavername = row.serverName
            row.pernum = 1
            // 将添加的图层的图层名称push到vuex的数组中，方便其他组建删除图层
            if(row.serverType == 'WVT'){
               this.rowfeature= mapUtil.createWVTLayer(url,name)
                 row.style = {
                        stroke: row.stroke,
                        fill: row.fill,
                        line:row.line,
                    }
                if(row.dataType=='Point'){
                     row.style.circle = row.fill
                }
                 this.rowfeature.setStyle(mapUtil.setStyle(row.style));
                   mapUtil._mapInstance.addLayer( this.rowfeature);
            }else{
                //  row.feature=mapUtil.wmsTileLayer(url,leavername,name,leaver,)
            }
        },
     // 改变地图服务透明度
        inputchange(val,row){
            this.rowfeature.setOpacity(val)
        },
         // 改变地图服务的颜色
        mapcolorchange(val,data,type){
            if(data.serverType == 'WVT'){
                if(type == 'stroke'){
                    data.style.stroke = val
                }else if(type == 'fill'){
                    if(data.dataType=='Point'){
                         data.style.circle = val
                    }else{
                         data.style.fill = val
                    }
                   
                }
             this.rowfeature.setStyle(mapUtil.setStyle(data.style));
            }else{
                //  row.feature=mapUtil.wmsTileLayer(url,leavername,name,leaver,)
            }
        },
          //改变地图服务的线宽
        handleChange(val,data){
        if(data.layerType == 'WVT'){
            data.line = val
            data.style.line = val
             this.rowfeature.setStyle(mapUtil.setStyle(data.style));
            }else{
                //  row.feature=mapUtil.wmsTileLayer(url,leavername,name,leaver,)
            }
        }

   
  }
};
</script>

<style scoped>
.server-warp {
  height: 100%;
  width: 100%;
  position: relative;
}
.fanhuicion {
  margin-right: 5px;
  font-size: 23px;
  height: 40px;
  width: 40px;
  text-align: center;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  top: 70px;
  z-index: 9;
}
.btntypechange {
  position: absolute;
  right: 0px;
  top: 60px;
  z-index: 9;
  height: 40px;
  padding: 0 10px;
  background: rgba(8, 13, 25, 0.67);
  background-image: url("../../assets/image/bg_pruduct.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.btnicon{
    font-size:25px;
    /* margin-right: 10px; */
    color: #fff;
    cursor: pointer;
    padding: 1px 4px;
}
.btnicon:last-child{
   margin-right: 0px; 
}
.btntypechange>>>.el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #183d4b;
    border-color: #183d4b;
    color: #EA530F;
}
.btntypechange>>>.el-radio-button--medium .el-radio-button__inner{
    padding: 5px 10px;
    font-size: 16px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    background: #fefefe;
}
.activemakeColor{
    color: #E5821E;
    /* background: rgba(159,157,155,.8); */
    border-radius: 6px;
   
}
</style>

<style scoped>
.dmdzcomend{
    /* height: 400px; */
    position: absolute;
    top: 54px;
    right: 0;
    background: #fff;
    z-index: 99;
    width: 350px;
}
.dmdzcomend-header{
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    justify-content: space-between;
    
}
.closeicon{
    color: #F01A1A;
    font-size: 30px;
    transition:.5s;
　　-webkit-transition:.5s;
　　　-moz-transition:.5s;
    cursor: pointer;
}
.closeicon:hover{
    color:#D3331E ;
    -webkit-transform:rotate(180deg) scale(1.2); 
　　-moz-transform:rotate(180deg) scale(1.2);
　　-ms-transform:rotate(180deg) scale(1.2);
　　-o-transform:rotate(180deg) scale(1.2);
}
.lpgosamn{
    display: flex;
    align-items: center;
    color: #6c757d;
}

.mapstyles{
    display: flex;
    align-items: center;
}
.mapstyles>span{
    font-size: 14px;
    width: 80px;
}
</style>