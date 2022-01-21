<template>
    <div class="generalmessage-warp">
        <div class="generalmessage-row" v-if="!isjuanmap">
            <!-- 地图组建 -->
            <mapInstance />
            <!-- 搜索框 -->
            <div class="generalmessage-row-search" style="display: flex;">
                <div  class="searchs-div" style="width:30%">
                    <el-select v-model="typevalue" placeholder="请选择" @change='typevalueChange'>
                        <el-option
                        v-for="item in typelist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div  class="searchs-div" style="width:55%">
                    <el-input v-model="inputvalue" clearable placeholder="请输入内容" @clear='inputclear' @change='inputchange' @focus='inputfocus'></el-input>
                </div>
                <div  title="搜索" class="searchs-div searchbtn" @click="searchClick" style="width:15%">
                    <i class="iconfont icon-sousuo"></i>
                </div>
            </div>

            <transition enter-active-class="animate__animated animate__slideInLeft" leave-active-class="animate__animated animate__slideOutLeft" :duration="{enter:3000, leave:3000}"> 
                <!-- 要素展示模块 -->
                <yslbcommed  :slobject='slobject' v-if="showyslb" @ipntuchanges='ipntuchanges' @btncloses='btncloses' ref="yslbcommed"/>
            </transition>
                
            <transition enter-active-class="animate__animated animate__slideInLeft" leave-active-class="animate__animated animate__slideOutLeft" :duration="{enter:3000, leave:3000}"> 
                <!-- 地名地址展示模块 -->
                <dmdzcomend v-if="showdmdz"  @btncloses='btncloses'/>
            </transition>

            <transition enter-active-class="animate__animated animate__slideInLeft" leave-active-class="animate__animated animate__slideOutLeft" :duration="{enter:3000, leave:3000}">
                <!-- 空间查询模块 -->
                <kjcxcomend v-if="showkjcx" @btncloses='btncloses' ref="kjcxcomend"/>
            </transition>
        
            <div class="btntypechange">
                <i :title="item.title" v-for="(item,index) in btnstype" :key="item.key+index" class="iconfont btnicon" :class= "[ moudelvalue == item.key ?'activemakeColor':'',item.icon]"  @click="moudlechange(item)"></i>
            </div>

            <transition enter-active-class="animate__animated animate__slideInRight" leave-active-class="animate__animated animate__slideOutRight" :duration="{enter:3000, leave:3000}"> 
                <!-- 图层管理模块 -->
                <tcglcomend v-show="moudelvalue == 'tcgl'" @clreamoudlevalue='clreamoudlevalue'/>
            </transition>

            <transition enter-active-class="animate__animated animate__slideInRight" leave-active-class="animate__animated animate__slideOutRight" :duration="{enter:3000, leave:3000}"> 
                <!-- 图例展示模块 -->
                <legendcomend v-show="moudelvalue == 'tlzs'" @clreamoudlevalue='clreamoudlevalue'/>
            </transition>

            <transition enter-active-class="animate__animated animate__slideInRight" leave-active-class="animate__animated animate__slideOutRight" :duration="{enter:3000, leave:3000}">
                <!-- 统计分析模块 -->
                <tjfxcomend v-show="moudelvalue == 'tjfx'" @clreamoudlevalue='clreamoudlevalue'/>
            </transition>

             <transition enter-active-class="animate__animated animate__slideInRight" leave-active-class="animate__animated animate__slideOutRight" :duration="{enter:3000, leave:3000}">
                <!-- 快速定位模块 -->
                <ksdwcomend v-show="moudelvalue == 'ksdw'"  @clreamoudlevalue='clreamoudlevalue'/>
            </transition>
        </div>

        <div v-if="isjuanmap" style="height:100%;width:100%">
            <mapserver />
        </div>
    </div>
</template>

<script>
import mapInstance from '@/components/map/mapInstance'
import mapserver from '@/components/map/swipermap' //地图卷帘组建
import yslbcommed from './component/yslbcommed' //要素类别模块
import dmdzcomend from './component/dmdzcomend' //地名地址模块
import kjcxcomend from './component/kjcxcomend' //空间查询模块 
import tcglcomend from './component/tcglcomend' //图层管理模块
import tjfxcomend from './component/tjfxcomend' //统计分析模块
import ksdwcomend from './component/ksdwcomend' //快速定位模块
import legendcomend from './component/legendcomend'
import creatfrom from '@/components/creatfrom/index' //搜索配置面板内容区
import {getSysFieldCondition} from '@/api/generalmessage/index.js'
import QS from 'qs';
export default {
    components:{
        mapInstance,yslbcommed,dmdzcomend,tcglcomend,tjfxcomend,kjcxcomend,ksdwcomend,creatfrom,mapserver,legendcomend
    },
    name:'generalmessage',
    data(){
        return{
            typelist:[
                {
                    value:"yslb",
                    label:"要素类别",
                },
                {
                    value:"dmdz",
                    label:"地名地址",
                },
                {
                    value:"kjcx",
                    label:"空间查询",
                }
            ],
            btnstype:[
                {
                    title:'图层管理',
                    icon:'icon-layer',
                    key:'tcgl'
                },
                {
                    title:'快速定位',
                    icon:'icon-hangzhengquhua',
                    key:'ksdw'
                },
                {
                    title:'统计分析',
                    icon:'icon-tongji',
                    key:'tjfx'
                },
                {
                    title:'图例展示',
                    icon:'icon-gongjuxiang',
                    key:'tlzs'
                }
            ],
            ksdwlist:[
                {
                    title:'行政区',
                    key:'xzq',
                    value:'',
                    icon:'icon-hangzhengquhuaguanl'
                },
                {
                    title:'流域分区',
                    key:'lyfq',
                    value:'icon-zhengtitubiaosvg_liuyu'
                },
                {
                    title:'资源分区',
                    key:'zyfq',
                    value:'icon-ziyuan'
                }
            ],
            breadcrumblist:['首页沙发斯蒂芬'],
            typevalue:"yslb",//搜索类型的绑定值
            inputvalue:'',//输入框的绑定值
            tucshow:false,//右侧图层管理是否展示
            moudelvalue:'',//右侧模块切换绑定值
            isfocus:false,//搜索框是否聚焦
            showyslb:false,//要素展示隐藏控制
            showdmdz:false,//地名地址隐藏控制
            showkjcx:false,//空间查询隐藏控制
            slobject:null,//水利对象数据
            isjuanmap:false, //是否开启卷帘模式
            dialogshownew:false,
        }
    },
    computed:{
            // 获取当前选中的水利对象
        activerole(){
            return this.$store.state.menuData.activerole;
            },
        isjuan(){
            return this.$store.state.menuData.isjuan;
        },
        searchpar(){
             return this.$store.state.menuData.slyspar;
        }
    },
    watch:{
        // 监听卷帘控制变化
        isjuan(newval,oldval){
            this.isjuanmap = newval
            if(newval == true){

            }
        },
    },
    mounted(){
        this.$nextTick(()=>{
            
        });
    },
    methods:{
        //搜索按钮点击事件
        searchClick(){
             
            if(this.typevalue == 'yslb'){  //当前在要素类别模块
              this.searchpar.serachname = this.inputvalue
              this.$store.dispatch('setslyspar',this.searchpar)
              if(this.$refs.yslbcommed){
                   this.$refs.yslbcommed.listsearchchange()
              }else{
                    this.inputfocus()
                    this.$nextTick(()=>{
                        this.$refs.yslbcommed.listsearchchange()
                  });
              }
            }else if(this.typevalue == 'kjcx'){  //当前在要素类别模块
                this.searchpar.serachname = this.inputvalue
                this.searchpar.spaceWkt = this.$store.state.menuData.spaceWkt
                this.$store.dispatch('setslyspar',this.searchpar)
                if(this.$refs.kjcxcomend){
                    this.$refs.kjcxcomend.showmoudlechange(false)
                    this.$refs.kjcxcomend.listsearch()
                }else{
                    this.inputfocus()
                    this.$nextTick(()=>{
                        this.$refs.kjcxcomend.showmoudlechange(false)
                        this.$refs.kjcxcomend.listsearch()
                    });
            }
            }
        },
        // 搜索框的change事件
        inputchange(val){

        },
        //最近搜索和热门搜索点击传过来的参数
        ipntuchanges(val){
            this.inputvalue = val
            // this.searchpar.tableNames = ''
            this.searchClick()
        },
        // 搜索框清空事件
        inputclear(){
            this.inputvalue = ''
            this.searchClick()
        },
        // 右侧快速定位和图层管理模块展示切换
        moudlechange(row){
           this.moudelvalue = row.key
        },
        // 右侧功能模块隐藏功能
        clreamoudlevalue(val){
            this.moudelvalue = ''
        },
        // 搜索框前的类型切换事件
        typevalueChange(val){
            this.typevalue = val
            this.isfocus = false
            this.showyslb = false
            this.showdmdz = false
            this.showkjcx = false
        },
        // 输入框的聚焦事件
        inputfocus(){
            this.isfocus = true
            if(this.typevalue == 'yslb'){
                this.showyslb = true
                this.showdmdz = false
                this.showkjcx = false
            }else if(this.typevalue == 'dmdz'){
                this.showyslb = false
                this.showdmdz = true
                this.showkjcx = false
            }else if(this.typevalue == 'kjcx'){
                this.showyslb = false
                this.showdmdz = false
                this.showkjcx = true
            }
            
        },
        // 搜索面板隐藏
        btncloses(val){
            if(val == 'A'){
                this.showyslb = false
            }else if(val == 'B'){
                this.showdmdz = false 
            }else if(val == 'C'){
                this.showkjcx = false 
            }
        },
        // 快速定位定位类型切换的change事件
        positiontypechange(val){
    
        },
        // 快速定位联级选择器的change事件
        handleChange(val){

        },
        // 根据点击确定的水利对象获取该水利对象的from表单创建的json数据
        getSysField(row){
            let par={
                spaceCode : row.spaceCode
            }
            getSysFieldCondition(par).then((res)=>{
                if(res.msg == '执行成功' && res.data.length !=0){
                    if(this.$refs.creatfrom){
                        this.$refs.creatfrom.fromjson = res.data
                    }
                    
                }
            })
        },
        // 表单重置事件
        resedialogt(){
            this.$refs.creatfrom.resedFormModelFn()
            // this.$store.dispatch('setdialogshow',false)
        },
    

    
    }
}
</script>

<style scoped>
.generalmessage-warp{
    position: absolute;
    top: 74px;
    left: 0;
    width: 100%;
    height: calc(100% - 75px);
    background: #fff;
    /* background: url('../../assets/image/huabu.jpg'); */
    background-size: cover;
}
.generalmessage-row{
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.generalmessage-row-search{
    position: absolute;
    width: 400px;
    height: 40px;
    left: 10px;
    top: 10px;
    z-index: 9;
    border-radius: 6px;
    background: rgba(6,30,62,.8);
}
.searchs-div{
    height: 100%;
}
.searchbtn{
    background: #0EB9EA;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
    width: 50px;
}
.searchs-div>>>.el-select{
    height: 100%;
}
.searchs-div>>>.el-input{
    height: 100%;
}
.searchs-div>>>.el-input--medium .el-input__inner{
    height: 100%;
}
.searchs-div>>>.el-input__inner{
    border: none;
    border-right: 1px solid #EA530F;
    background: rgba(0,0,0,0);
    color: #fff;
    font-size: 16px;
    border-radius: 0;
    height: 100%;
}
</style>

<style scoped>
.showTjbtn{
    position: absolute;
    height: 40px;
    left: 420px;
    top: 10px;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border-radius: 6px;
    background:#152C3F;
    padding: 0 6px;
    color: #fefefe;
    border: 0px;
    
}
.showTjbtn i{
    font-size: 20px;
    margin-right: 5px;
}
</style>

<style scoped>
.btntypechange{
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 9;
    height: 40px;
    padding: 0 10px;
    background: rgba(8, 13, 25, 0.67);
    background-image: url('../../assets/image/bg_pruduct.png');
    background-size: 100% 100%;;
    background-repeat: no-repeat;
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.btnicon{
    font-size:28px;
    margin-right: 10px;
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
</style>



<style>
.el-cascader-menu{
    color: #fff;
    border-right: 0px;
}
.el-cascader__dropdown{
    background: rgba(6,30,62,.76);
    border: 0px;
}
.el-cascader-node:not(.is-disabled):hover, .el-cascader-node:not(.is-disabled):focus{
     background: rgba(6,30,62,.82);
}
</style>

<style scoped>
.activemakeColor{
    color: #E5821E;
    background: rgba(159,157,155,.8);
    border-radius: 6px;
   
}
</style>

<style lang='scss' scope="scoped">
.ol-overlaycontainer .ol-overlay-container {
    span {
        display: block;
        width: 42px;
        height: 42px;
        // border-radius: 50%;
        background: red;
    //    cursor: pointer;
    }
}
</style>


