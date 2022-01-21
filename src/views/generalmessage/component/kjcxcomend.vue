<template>
  <div class="yscomend searchcomend">
    <div class="yscomed-warp"  v-if="showsearch">
      <div class="close-warp">
        <div class="sousuo-warp">
          <i class="iconfont icon-zhanshi"></i>
          <span>搜索面板</span>
        </div>
        <i class="el-icon-s-fold closei" @click="btnclose('C')"></i>
      </div>
      <div class="warp-comnde">
           <!-- 水利对象 -->
        <div class="shuili-comed warp-comden">
          <div class="warp-header">
            <div class="warp-header-right">
              <div class="headerlist"></div>
              <span>要素类型</span>
            </div>

            <el-checkbox v-model="checked" @change="checkChange">全选/全不选</el-checkbox>
 
          </div>
          <ul class="history-warp">
              <Rolelist ref="Rolelist" :checktype='checktype'  />
          </ul>
        </div>

        <div class="maostylemeaud">
            <div style="" class="maostylemeaud-header">
              <el-radio-group @change='radiochange' v-model="positiontype" size="small">
                <el-radio-button :label="item.value" v-for="item in typelist" :key="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
            </div>

            <div class="position-coment">
                <div class="distancevalue">
                    <span style="width:21%;color:#fff">缓冲距离</span>
                    <el-input  placeholder="请输入内容"  v-model="distancevalue"  clearable style="width:50%"></el-input>
                     <span style="color:#B9BABA;width:10%;text-align: center;" >km</span>
                </div>

                <div class="distancevaluetype" v-show="positiontype=='bhsq'">
                    <span style="width:21%;color:#fff">绘制类型</span>
                    <div class="distancevaluetype-radios">
                        <el-radio-group v-model="drawtype" @change='maptypechange'>
                          <el-radio :label="item.value" v-for="item in drawtypelist" :key="item.value">{{item.title}}</el-radio>
                        </el-radio-group>
                    </div>
                </div>

                 <div class="distancevaluetype" v-show="positiontype=='zbsq'" style="align-items: center;">
                   <span style="width:21%;color:#fff">坐标位置</span>
                    <div class="distancevaluetype-radios inputsfatherdiv">
                        <div class="distancevalue inputdivs">
                           <el-input placeholder="请输入内容" v-model="positionx">
                              <template slot="prepend">经度</template>
                            </el-input>
                            <el-input placeholder="请输入内容" v-model="positiony">
                              <template slot="prepend">纬度</template>
                            </el-input>
                        </div>
                        <!-- 坐标拾取logo -->
                        <span class="mappositionspan">
                          <i @click="mappoint" class="iconfont icon-shiqu iconfontclass" :class="positionisavtive?'isactiveicon':'noactiveicon'" style="font-size: 40px;"></i>
                        </span>
                    </div>
                 </div>

                <div  class="dialog-footer warp-fotter">
                  <el-button @click="resedialogt">重 置</el-button>
                  <!-- <el-button type="primary" @click="onsubmit">确 定</el-button> -->
                </div>
            </div>

        </div>
      </div>
    </div>
    <div class="yscomed-warp" v-else>
      <listshow @showmoudlechange='showmoudlechange' ref="listshow" />
    </div>
  </div>
</template>

<script>
import Rolelist from '@/components/factorobject/index'
import listshow from '@/components/listshow/index'
import mapDraw from '@/utils/mapDraw'
import mapUtil from "@/utils/Openlayer-utils";
import { transform, getTransform, transformExtent, Projection } from "ol/proj";
import {unByKey} from 'ol/Observable';
export default {
  name: "kjcxcomend",
  components:{
    Rolelist,listshow
  },
  data() {
    return {
        checked:'',
        checktype:'checkbox',
        positiontype:'bhsq',//坐标拾取的类型绑定值
        typelist:[
          {
            label:'标会拾取',
            value:'bhsq'
          },
          {
            label:'坐标拾取',
            value:'zbsq'
          }
        ],
        distancevalue:'20',//缓冲距离值
        drawtype:'',//绘图类型
        positionx:'',
        positiony:'',
        showsearch:true,
        positionisavtive:false,
        drawtypelist:[
          {
            title:'点',
            value:'Point'
          },
          {
            title:'线',
            value:'LineString'
          },
          {
            title:'多边形',
            value:'Polygon'
          },
          // {
          //   title:'圆',
          //   value:'Circle'
          // },
          // {
          //   title:'矩形',
          //   value:'Square'
          // }
        ]
    };
  },
  computed:{
        isclearmap(){
            return this.$store.state.menuData.isclearmap;
        }
    },
  watch:{
        isclearmap(newvla,oldval){
        
            this.clearmapdraw();
        }
    },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    // 隐藏面板的方法
    btnclose(val) {
      this.$emit("btncloses", val);
    },
    // 全选和全不选的选择框change事件
    checkChange(val) {

    },
    // 切换事件
    radiochange(){
      mapDraw.clearDrawLayer()
      mapUtil.clearLayer('pointmap')
      this.resedialogt()
    },
    // 根据选择的类型画面
    maptypechange(val){
      mapDraw.clearDrawLayer()
      mapDraw.drawinit(val,this.distancevalue)
      
    },
    // 坐标拾取器
    mappoint(){
      let point = null
      let that = this
      that.positionisavtive = true
      let positionlogo = require('../../../assets/image/ding.png')
      let mapclick= mapUtil._mapInstance.on("click",function(evt){
                mapUtil.clearLayer('pointmap')
                point = evt.coordinate;
                let newpoint= transform(point,"EPSG:3857","EPSG:4326")
                that.positionx = newpoint[0]
                that.positiony = newpoint[1]
                let pointfeater= mapUtil.createFeature("point","positionpoint",newpoint,'')
                let styleObj = {
                        icon : positionlogo,
                        scale:.8,
                        offsetOrigin:'top-left',   
                        };
                pointfeater.setStyle(mapUtil.setStyle(styleObj));
                let ferterlist = [pointfeater]
                mapUtil.createLayer(ferterlist,'pointmap',9)
                  unByKey(mapclick)
                        },map);
      

    },
    // 删除添加的图层和初始化按钮
    clearmapdraw(){
      if(this.positiontype=='bhsq'){
        mapDraw.clearDrawLayer()
         
      }else{
        mapUtil.clearLayer('pointmap')
        
      }
      this.drawtype = ''
      this.distancevalue = '20'
      this.positionx = ''
      this.positiony = ''
      this.positionisavtive = false
      
      
    },
    // 重置事件
    resedialogt(){
      this.clearmapdraw()
    },
    // 确定事件
    onsubmit(){
    },
    // 详情面板与搜索面板的展示切换
    showmoudlechange(isshow){
      this.showsearch = isshow
      if(isshow){
        this.clearmapdraw()
      }
      
    },
      // 搜索按钮点击事件
    listsearch(){
      this.$nextTick(()=>{
        this.$refs.listshow.serachbtn();
      });
    },
  }
};
</script>

<style scoped>
.yscomend {
  height: 650px;
  box-shadow: 0 0 10px 3px rgb(20 142 195 / 80%);
}
.yscomed-warp{
  position: relative;
  height: 100%;
  width: 100%;

}

</style>
<style scoped>
.omeystab{
  right: -49px;
  top: 4px;
}
.tabsome{
  position: absolute;
  height: 140px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: url('../../../assets/image/noactivetab.png') no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
.anyystab{
  right: -49px;
  top: 120px;
}
.tabspan{
  writing-mode: tb-rl;
  line-height: 26px;
  letter-spacing: 3px;
  margin-left: -6px;
}
.yscomed-warp .isactivetab{
  background: url('../../../assets/image/noactivetab.png') no-repeat;
  background-size: 100% 100%;
  color: #E5821E;

}
.maostylemeaud{
  height: 45%;
}
.distancevalue{
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}

</style>

<style scoped>
.shuili-comed {
  height: 55%;
  width: 100%;
}
.history-comed {
  height: 15%;
}
.warp-header {
  height: 35px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  align-items: center;
}
.history-warp {
  height: calc(100% - 35px);
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}
.warp-header-right {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #0eb9ea;
}
.headerlist {
  width: 2px;
  height: 20px;
  background: #d85d0f;
  margin: 0 10px 0 0;
}
.claearspan {
  color: aqua;
  cursor: pointer;
}
.el-checkbox {
  color: #fff;
}
.maostylemeaud-header{
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 10px;
}
.position-coment{
  height: calc(100% - 100px);
  width: 100%;
  padding: 0 10px;
}
.distancevaluetype{
  height: calc(100% - 50px);
  width: 100%;
  margin-top: 10px;
  display: flex;
}
.distancevaluetype-radios{
  width: 78%;
}

.inputdivs{
  width: 80%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: 90%;
}
.inputsfatherdiv{
  height: 100%;
  display: flex;
  align-items: center;
}
.mappositionspan{
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}
.iconfontclass{
  cursor: pointer;
 
}
.isactiveicon{
  color: #E89B12;
}
.noactiveicon{
   color: #0eb9ea;
}
</style>