<template>
    <div class="ksdwcomend-warp right-moudle">
       <div class="close-warp">
            <div class="sousuo-warp">
                <i class="iconfont icon-tongji"></i>
                <span>快速定位配置面板</span>
            </div>
            <i class="el-icon-s-unfold closei" @click="tcglbtnclose('ksdw')"></i>
        </div>

        <div class="warp-comnde ksdwcomend-comend">
            <div class="ksdwcomend-comend-search">
                <div :span="13" class="searchs-div">
                    <el-input v-model="searchvalue" @clear='inputClear' clearable placeholder="请输入内容"></el-input>
                </div>
                <div :span="4" title="搜索" class="searchs-div searchbtn" @click="searchClick">
                    <i class="iconfont icon-sousuo"></i>
                </div>
            </div>

            <div class="ksdwcomend-comend-nav">
                <ul class="ksdwcomend-comend-nav-btn">
                    <li v-for="item in moudlelist" :key="item.key" class="nav-btns" :class="activeName == item.id ? 'isactivebtn' :'' ">
                        <i :class="item.icon"></i>
                        <span  @click="moudletypebtn(item)">{{item.label}}</span>
                    </li>
                </ul>
               <div class="citytabs warp-comden" style="height: 40px;">
                   <div v-for="(item,index) in citylist" :key="item.code" style="color:#fff"> 
                       <span @click="activecityclick(item,index)" style="cursor: pointer;">{{item.fRegionName }}</span>
                       <i class="el-icon-arrow-right" style="color:#D3CECC" v-show=" Number(index+1) != citylist.length"></i>
                    </div>
               </div>
                <!-- 行政区划模块 -->
                <ul class="getRegoin-warp testscrollbar">
                    <li v-for="(item) in fatherlist" :key="item.fId" style="" class="citylists">
                        <span @click="citynamegetRegoin(item,false)" :class="fatherindex == item.fRegionCode ? 'isfather':'' " class="citylistsspan"> {{item.fRegionName}}</span>
                        <ul class="citylistschild">
                            <li v-for="(row,ind) in item.children" :key="ind">
                                <span @click="citynamegetRegoin(row,true,item)" :class="sonindex == row.fRegionCode ? 'isfather':''"> {{row.fRegionName}}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
// import getRegoin from './getRegoin'
import {getRegoin,roleLayergeoJson} from '@/api/generalmessage/index.js'
import mapUtil from "@/utils/Openlayer-utils";
export default {
    name:"ksdwcomend",
    components:{
        // getRegoin,
    },
    data(){
        return{
            searchvalue:'',
            activeName:'XZQH',//快速定位类型展示模块绑定值
            moudlelist:[
                {
                    label:'行政区域',
                    key:'xzqy',
                    value:'xzqy',
                    icon:'iconfont icon-hangzhengquhua',
                    id:'XZQH'
                },
                {
                    label:'流域分区',
                    key:'lufq',
                    value:'lufq',
                    icon:'iconfont icon-zhengtitubiaosvg_liuyu',
                    id:'LYFQ'
                },
                {
                    label:'水资源分区',
                    key:'szyfq',
                    value:'szyfq',
                    icon:'iconfont icon-shuiziyuan',
                    id:'SZYFQ'
                }
            ],
            citylist:[
                {
                    fRegionName:'全国',
                    fParentRegionCode:'0',
                    fLevel:'0',
                }
            ],
            fatherlist:[],
            fatherindex:'',
            sonindex:'',
            maxindex:3,//最大的层级
            regoinpramise:{
                fLevel:'1',
                fParentRegionCode:'0',
                geoType:'XZQH'
            },
        }
    },
    mounted(){
        this.$nextTick(() =>{
            this.getRegoin(this.regoinpramise)
            
        });
    },
    computed:{
        isclearmap(){
            return this.$store.state.menuData.isclearmap;
        }
    },
    watch:{
        isclearmap(newvla,oldval){
             mapUtil.clearLayer('boundaryLayer')
        }
    },
    methods:{
        // 关闭面板方法
        tcglbtnclose(str){
            
            this.$emit('clreamoudlevalue',str);
        },
        // 搜索按钮点击事件
        searchClick(){
            this.citylist= this.citylist.splice(0,1);
            let par = {
                fRegionName : this.searchvalue,
                geoType :this.activeName,
            }
            if(this.searchvalue ==''){

            }else{
                 this.getRegoinname(par)
            }
           
        },
        // 输入框清空事件
        inputClear(){
            this.citylist= this.citylist.splice(0,1);
            this.clearmap(true)
            this.getRegoin(this.regoinpramise)
        },
        moudletypebtn(row){
            this.searchvalue = ''
            this.activeName = row.id
            this.clearmap()
            this.citylist= this.citylist.splice(0,1);
            this.fatherlist = []
            let par = this.searchuntil()
            this.getRegoin(par)
        },
        // 根据模块定义接口请求参数
        searchuntil(parsed){
            let par = null
            if(this.activeName == 'XZQH'){  // 行政区模块获取数据
            this.maxindex = 3
              if(parsed){
                par = parsed
              }else{
                par = this.regoinpramise
              }
              
            }else if(this.activeName == 'LYFQ'){  // 流域分区模块获取数据
            this.maxindex = 1
                par = this.regoinpramise
            }else if(this.activeName == 'SZYFQ'){ // 水资源分区模块获取数据
            this.maxindex = 1
               par = this.regoinpramise
            }
            par.geoType = this.activeName
            return par
        },
        // 获取行政区数据
        getRegoin(par,row){
            getRegoin(par).then((res)=>{
                if(row && row.fLevel<3){
                    this.fatherlist = []
                    this.fatherlist.push(row)
                    for(var i=0;i< res.data.length;i++){
                        if(res.data[i].fRegionCode != row.fRegionCode){
                            this.fatherlist.push(res.data[i])
                        }else{
                            this.fatherlist[0]= res.data[i]
                        }
                    }
                }else{
                    this.fatherlist = res.data
                }
            })
        },
        // 根据名称搜索的行政区数据
        getRegoinname(par){
             getRegoin(par).then((res)=>{
                this.fatherlist = []
                this.fatherlist = res.data
                this.citylist.push(res.data[0])
                this.fatherindex = res.data[0].fRegionCode
                this.getjsondata(res.data[0])
             })
        },
        // 模块节点点击事件
        activecityclick(row,index){
            this.citylist = this.citylist.splice(0,index)
            this.citylist.push(row)
            let regoinpramise=this.searchuntil()
            if(row.fRegionName == '全国'){
                this.clearmap(true)
                this.getRegoin(regoinpramise)
            }else{
                this.citynamegetRegoin(row,false,null,true)
            }
        },
        // 点击城市名称的事件
        citynamegetRegoin(row,hasfather,fathervalue,isactive){
            this.clearmap(false)
            var result = this.citylist.some(item=>item.fLevel==row.fLevel) //点击父节点判断是否有同级的
            if(hasfather){
                var resultlayer = this.citylist.some(item=>item.fLevel==fathervalue.fLevel) //点击子节点判断是否有同级的
                if(resultlayer && result){
                    for(var i=0;i<this.citylist.length;i++){
                        if(this.citylist[i].fLevel == fathervalue.fLevel){
                            this.citylist.splice(i, 1,fathervalue);
                        }
                    }
                    for(var j=0;j<this.citylist.length;j++){
                        if(this.citylist[j].fLevel == row.fLevel){
                            this.citylist.splice(j, 1,row);
                        }
                    }
                }else if(resultlayer && !result){
                    for(var i=0;i<this.citylist.length;i++){
                        if(this.citylist[i].fLevel == fathervalue.fLevel){
                            this.citylist.splice(i, 1,fathervalue);
                        }
                    }
                    this.citylist.push(row)
                }else if(!resultlayer && result){
                     for(var i=0;i<this.citylist.length;i++){
                        if(this.citylist[i].fLevel == row.fLevel){
                            this.citylist.splice(i, 1,row)
                        }
                    }
                }if(!resultlayer && !result){
                    this.citylist.push(fathervalue)
                    this.citylist.push(row)
                    
                }
                if(Number(row.fLevel)< this.maxindex){
                    this.fatherindex = this.citylist[this.citylist.length-1].fRegionCode
                }else{
                    this.fatherindex = this.citylist[this.citylist.length-2].fRegionCode
                    this.sonindex = this.citylist[this.citylist.length-1].fRegionCode
                }
            }else{
                this.fatherindex = row.fRegionCode
                if(result){
                    for(var i=0;i<this.citylist.length;i++){
                        if(this.citylist[i].fLevel == row.fLevel){
                           this.citylist = this.citylist.splice(0,i)
                           this.citylist.push(row)
                        }
                    }
                }else{
                    this.citylist.push(row)
                }
            }
          this.getjsondata(row)
            let regoinpramise={
                fLevel:row.fLevel,
                fParentRegionCode:row.fParentRegionCode,
                geoType :this.activeName
            }
            // 如果层级小于最大层级 且已选中的层级中没有同层级的再去请求新数据
            if(Number(row.fLevel)< this.maxindex && !result || isactive){
                 this.getRegoin(regoinpramise,row)
            }
        },
        // 获取图层数据
        getjsondata(row){
            let par={
                geoType : this.activeName,
                fRegionCode : row.fRegionCode
            }
            roleLayergeoJson(par).then((res)=>{
                if(res.msg=='执行成功'){
                    this.ceratmapfeater(res.data[0])
                }
            })
        },
        // 创建图层
        ceratmapfeater(data){
            let feature= mapUtil.createGeoJsonFeature(JSON.parse(data))
            let styleObj = {
                circle: "",
                fill: "rgba(233,224,220,0.3)",
                stroke: "rgba(21,44,219)",
                line: 4
                };
             mapUtil.createLayer(feature,'boundaryLayer',2,styleObj,'Geojson'); //添加图层
             mapUtil.mapcenterposion(feature) //图层定位
        },
        // 初始化地图
        clearmap(isfw){
            if(isfw){
              mapUtil.restoreView()
            }
            mapUtil.clearLayer('boundaryLayer')
            this.$store.dispatch('deletedayersnameList', 'boundaryLayer')
            this.fatherindex = ''
            this.sonindex = ''
        },
        
    }
}
</script>

<style scoped>
.ksdwcomend-warp{
    height: 400px;
    width: 400px;
    box-shadow: 0 0 10px 3px rgb(20 142 195 / 80%);
    padding: 5px;
}
.ksdwcomend-comend-search{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.searchs-div{
    height: 80%;
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
    border: 1px solid #0EB9EA;
    background: rgba(0,0,0,0);
    color: #fff;
    font-size: 16px;
    border-radius: 0;
    height: 100%;
}
.ksdwcomend-comend-nav{
    height: calc(100% - 55px);
    padding: 5px;
}
.el-tabs--border-card{
    background: rgba(7,30,60,.76);
    border-radius: 15px;
    border: 0px;
}
.tbaspan{
    color: #fff;
    display: flex;
    align-items: center;
    height: 100%;
}
.tbaspan i{
    margin-right: 5px;
    font-size: 20px;
}
.comend-warpsed{
    width: 100%;
    height: 100%;
}
.citytabs{
    height:  40px;
    display: flex;
    align-items: center;
    color: #fff;
}
.getRegoin-warp{
    height: calc(100% - 90px);   
    padding: 0;
    margin: 0;
    overflow-y: auto;
    overflow-y: auto;
    margin-top: 10px;
}
.citylists{
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    min-height: 100px;
    margin-top: 15px;
}
.citylistsspan{
    cursor: pointer;
    width:20%;
    text-align: center;
}
.citylistschild{
    width: 80%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    padding-right: 7px;
}
.citylistschild li{
    margin-left: 10px;
    margin-bottom: 10px;
    cursor: pointer;
}
.isfather{
    color: #E05721;
    font-weight: 900;
    font-size: 18px;
}
</style>
