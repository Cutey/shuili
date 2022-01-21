<template>
    <div class="tjfxcomend-warp right-moudle">
        <div class="close-warp">
            <div class="sousuo-warp">
                <i class="iconfont icon-tongji"></i>
                <span>{{headertitle}}</span>
            </div>
                <i class="el-icon-s-unfold closei" @click="tcglbtnclose('tcgl')" v-show="!haseacher"></i>
                <i class="fa fa-reply closei fanhuicion iconclass" @click="fanhuiClick" style="" v-show="haseacher"></i>
        </div>

        <div  class="warp-comnde tjwarp" v-if="!haseacher">
            <div class="warp-comend">
               <!-- 水利对象 -->
                <div class="shuili-comed boederbottom" style="height: 45%;">
                    <div class="warp-header">
                        <div class="warp-header-right">
                        <div class="headerlist"></div>
                        <span>要素类型</span>
                        </div>

                        <!-- <el-checkbox v-model="checked" @change="checkChange">全选/全不选</el-checkbox> -->
        
                    </div>
                    <ul class="history-warp">
                         <Rolelist :checktype='checktype' @tjfxradiochange='tjfxradiochange' ref="Rolelist" />
                    </ul>
                    
                </div>
                <!-- 统计维度 -->
                <div class="history-comed warp-comden" style="height:20%"  v-show="!showform">
                     <div class="warp-header">
                        <div class="warp-header-right">
                        <div class="headerlist"></div>
                        <span>统计维度</span>
                        </div>
                    </div>
                    <div class="history-warp tjwedu" style="justify-content: center;">
                        <el-radio v-model="tjwdradio" :label="item.value" :value="item.value" v-for="item in moudlelist" :key="item.key">{{item ? item.label  : '暂无数据'}} </el-radio>
                    </div>
                </div>
                 <!-- 统计指标 -->
                 <div class="history-comed warp-comden"  style="height:20%"  v-show="!showform">
                     <div class="warp-header">
                        <div class="warp-header-right">
                        <div class="headerlist"></div>
                        <span>统计指标</span>
                        </div>
                    </div>
                    <div class="history-warp tjwedu" style="justify-content: center;">
                       


                        <el-checkbox v-model="tjzbcheck"  :value="item.value" :label="item.value" v-for="item in indicatorsList" :key="item.value">{{item.label || "暂无数据"}}</el-checkbox>

                        
                   
                    </div>
                </div>

                <div  class="matbspan"  v-show="!showform">
                    <span style="color: #fff; margin: 0 auto;line-height: normal;display: flex;align-items: center;" @click="moreclick"><i class="fa fa-angle-double-down"></i> 更多</span>
                </div>

                <div v-if="showform" style="height:51%;overflow-y: auto;" class="testscrollbar">
                    <creatfrom class="fromheight" @doubleup='doubleup' ref="creatfrom"/>
                </div>
                <div  class="matbspan" v-show="showform">
                        <span style="color: #fff; margin: 0 auto;line-height: normal;display: flex;align-items: center;margin-top:-10%" @click="doubleup"><i class="fa fa-angle-double-up"></i>收起</span>
                </div>
            </div>

                

            <div class="warp-fotter">
                <el-button @click="reafrom">重置</el-button>
                <el-button type="primary" @click="searchtj">统计</el-button>
            </div>
        </div>

        <div class="warp-comnde" v-else>
            <!-- 统计图的图表展示 -->
            <div class="tongji-eacher" style="height:100%">
                <Echarslist ref="echarsList" @tongjiEchaes="searchtj" :dataechar="dataechar" :moudlelist="moudlelist" :tjwdradio="tjwdradio" />
            </div>

          
        </div>
    </div>
</template>

<script>
import Rolelist from '@/components/factorobject/index'
import Echarslist from '@/components/statistical/index'

import {getFeatureCondition,selectTargetList,getSysStatisTargete,getSysFieldCondition} from '@/api/generalmessage/index.js'
import creatfrom from './creatfrom.vue' //搜索配置面板内容区
export default {
    name:'tjfxcomend',
    components:{
        Rolelist,creatfrom,Echarslist
    },
    data(){
        return{
            checked:false,
            checktype:'tjfx',
            headertitle:'统计面板',
            tjwdradio:'',//统计纬度绑定值
            tjzbcheck:[],//统计指标绑定值
            showform:false,
           dataechar:{},
            haseacher:false,//是否显示统计图
            crearform:null,
           parmise:null,
        // 统计维度数组
           moudlelist:[],
        // 统计指标数组
            indicatorsList:["暂无数据"]
        }
    },
    computed:{
        tjfxactiverole(){
            return this.$store.state.menuData.tjfxactiverole
            
        }
    },
    watch:{
        tjfxactiverole(newval,oldval){
            if(newval){
                let par = {
                    spaceCode : newval.spaceCode
                }
                this.getactiveroleCondition(par)
            }
        }
    },
    mounted(){
           
        this.$nextTick(()=>{

          });
    },
    methods:{
        
        // 关闭面板方法
        tcglbtnclose(str){
            this.$emit('clreamoudlevalue',str);
        },
        checkChange(){
            
        },
         // 获取选中的水利对象的排序数据
        getactiveroleCondition(par){
            getFeatureCondition(par).then((res)=>{
                if(res.data && res.data.length !=0){
                    this.slortoptions = []
                    
                    let lsits = res.data
                    for(var i=0;i<lsits.length;i++){
                        if(lsits[i].isorder){
                          let obj = {
                                label:lsits[i].alias,
                                value:lsits[i].tablefield
                            }
                            this.slortoptions.push(obj)
                        }
                    }
                }
            })
        },
        // 更多点击事件
        moreclick(){
            this.showform = true
            if(this.tjfxactiverole && this.tjfxactiverole.spaceCode !=''){
                this.$nextTick(()=>{
                    if(this.$refs.creatfrom)
                    this.$refs.creatfrom.getSysField(this.tjfxactiverole)
                });
            }
           
        },
        //收起事件
        doubleup(){
           
            this.showform = false
        },
        //表单重置按钮
        reafrom(){
            this.checked=false,
            this.checktype='tjfx',
            this.tjwdradio = '',
            this.tjzbradio = ''
            // this.$store.dispatch('setjfxactiverole',null)
        },
        // 统计按钮
        searchtj(){
            this.headertitle = '统计展示'
            this.haseacher = true;
            this.dataechar ={
                StatDimen:this.tjwdradio,
                StatIndicator:this.tjzbcheck,
                data:this.$store.state.menuData.formdata,
                regionCode:"",
                spaceCode:this.tjfxactiverole.spaceCode,
            }
        },
        // 图表返回按钮
        fanhuiClick(){
            this.headertitle = '统计面板'
            this.haseacher = false;
              this.$refs.echarsList.deleteFeater()
        },
        // 要素列表选中状态重置
        resetactivechange(){
          if(this.$refs.Rolelist){
            this.$refs.Rolelist.resetactive()
          }
        },
        tjfxradiochange(row){
            this.doubleup()
             let data = {
                 spaceName:row.spaceCode
             }
             this.reafrom()
            this.getselectTargetList(data)
            this.getSysStatisList(data)
        },
        // 获取统计指标
        getselectTargetList(data){
          
         selectTargetList(data).then(res => {
        if (res) {
           this.indicatorsList = res.data
            //    默认选中第一项
       if( this.indicatorsList.length>0){
               this.tjzbcheck[0] =this.indicatorsList[0].value
       }
        }
      });
        },
        // 获取统计维度
        getSysStatisList(data){
        getSysStatisTargete(data).then(res => {
        if (res.sysStatisTargets) {
           this.moudlelist = res.sysStatisTargets;
        //    默认选中第一项
       if( this.moudlelist.length>0){
               this.tjwdradio =this.moudlelist[0].value
       }
        } 
      });
        },
           
  
    }
}
</script>

<style scoped>
.tjfxcomend-warp{
    height: 650px;
    width: 400px;
}
.tjwarp{
    
}
.warp-comend{
    width: 100%;
    height:calc(100% - 45px);
}
 
 
.matbspan{
height: 40px;
display: flex;
justify-content: center;
align-items: center;
/* margin-top: 15px; */
}
.matbspan>span{
    cursor: pointer;
}
.matbspan>span i{
    color: #0eb9ea;
    font-size: 20px;
    margin-right: 5px;
}
 
 
</style>