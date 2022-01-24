<template>
    <div class="yscomed-warp">
      <div class="close-warp">
        <div class="sousuo-warp">
          <i class="iconfont icon-zhanshi"></i>
          <span>{{headertitle}}</span>
        </div>
        <i class="fa fa-reply closei fanhuicion iconclass" @click="fanhuiClick" style=""></i>
      </div>
      <div class="warp-comnde" v-show="showlist">
         <ul class="factor warp-comden testscrollbar" style="height: 90px;padding-top: 10px;overflow-y: auto" :class="checkboxlist.length>2?'':'isstart'">
             <li :class="activeroleson && activeroleson.spaceName==item.spaceName ? 'isactive':'noactive'" @click="radioClick(item)"  v-for="item in checkboxlist" :key="item.tableName">{{item.spaceName+'('+item.total+')'}}</li>
        </ul>
      
        <div class="searchdivs">
            <span @click="showsearch"><i class="fa fa-search searchswich"></i> 条件搜索</span>
            <div class="searchdivs-right">
                <span>排序:</span>
                <el-select v-model="slortvalue" placeholder="请选择" @change="slortvaluechange">
                    <el-option
                    v-for="item in slortoptions"
                    :key="item.value"
                    :label="item.label"
                    class="searchslort"
                    :value="item.value">
                    </el-option>
                </el-select>
                <!-- 升序 -->
                <i class="fa fa-sort-numeric-asc sortfaicon iconclass" title="升序" v-show="sloretype=='DESC'" @click="sloretypechange('ASC')"></i>
                <i class="fa fa-sort-numeric-desc sortfaicon iconclass" title="降序" v-show="sloretype=='ASC'" @click="sloretypechange('DESC')"></i>
            </div>
        </div>
        <!-- :class="isactivetab == 'onetab' ? 'onetabheight' : 'anytabheight' " -->

        <ul class="warpcomend listrowshow testscrollbar anytabheight" v-show="fromisshow"> 
            <li v-for="(item,index) in resdatalist" :key="index" class="listrowshow-lis">
                <div class="listrowshow-logo" :class="'imgposition'+index" @mouseover="changeMask(index,true,item)" @mouseout="changeMask(index,false,item)">
                    <!-- <span>{{index+1}}</span> -->
                </div>
                <div class="listrowshow-conent">
                    <span style="font-size:16px">{{item[objcloument[0].attName]}}</span>
                    <!-- <span style="font-size:14px;color:#0B629F">{{item[objcloument[1].attName]}}</span> -->
                </div>

                <div class="listrowshow-btns">
                    <i class="iconfont icon-zuobiaoshiqu mapcion"  ref="mapButton"  :class="ismapobjindex == index? 'mapactivebtn' : '' " title="地图展示" @click="mapbtns(item,index)"></i>
                    <i class="el-icon-s-order mapcion" title="详情" @click="btnitem(item)"></i>
                </div>
            </li>
        </ul>
         <div class="fromWrap"  style="height:70%" v-if="!fromisshow" >
              <creatfrom  @doubleup="doubleup" class="fromheight" ref="creatfromyslx" />
               <div  class="matbspanysq" @click="fromSq"  style="margin-top:10%">
                    <span style="color:#fff"><i class="fa fa-angle-double-up"></i>收起</span>
                </div>  
      </div>
        <div class="listfooter" style="background: rgba(0,0,0,0);" v-show="fromisshow">
            <Pagination @pageNochange='pageNochange' :total='total' ref="Pagination"/>
        </div>


      </div>

      <div class="warp-comnde" v-show="!showlist">
        <ul class="ksdwcomend-comend-nav-btn warp-comden" style="justify-content: flex-start;">
            <li v-for="item in moudlelist" style="height:30px" :key="item.value" class="nav-btns" :class="activemoudle && activemoudle.value == item.value ? 'isactivebtntype' :'' ">
                <i :class="item.icon"></i>
                <span  @click="moudletypebtn(item)">{{item.lable}}</span>
            </li>
        </ul>

        <div class="xiangqingvar"> 
            <particulars ref="particulars"/>
        </div>

        <ul class="factor moudlebtns">
            <li v-for="item in activeitem" :key="item.key">
                <i class="" :class="item.icon"></i>
                <span>{{item.label}}</span>
            </li>
        </ul>

      </div>
    </div>
</template>

<script>
import {getSysFieldCondition,selectDynamic,getTableFieldOrder,getAllTableName,getGeo} from '@/api/generalmessage/index.js'
import mapUtil from "@/utils/Openlayer-utils";
import creatfrom from "@/views/generalmessage/component/creatfrom";
import Pagination from '@/components/Pagination/index'
import particulars from '@/components/particulars/index'
import imgrer from "@/assets/image/mapposition.png";
import { Style, Fill, Stroke, Icon } from "ol/style";
export default {
    name:'listshow',
    components:{
        Pagination,particulars,creatfrom
    },
    props:{
        isactivetab:{
            type:String,
            default:'onetab'//radio 为单选，checkbox 为多选
        }
    },
    data(){
        return{
            activeroleson:null, //选中的水利对象绑定值
            slortvalue:'',//排序方式的绑定值
            resdatalist:[],//列表展示数据
            headertitle:'列表展示',
            showlist:true,
            objcloument:null,
            textColor:"", //要素提示文本颜色
            total:0,
            fractorlist:[],
           mapActive:'',
        //    表单显影
             fromisshow:true,
            ismapobjindex:null,
            ismapobj:null,
            activemoudle:null,
            activefeaturelist:[],
            mapRed:null,
            featurelist:[],
            layerobj:null,//添加的地图图层
            featurelist : [],//显示的当前页的地图图层数组
            moudlelist:[
                {
                    lable:'基础信息',
                    value:'jcxx',
                    icon: 'el-icon-s-order'
                }
            ],
            activeitem:[
                {
                    label:"搜关联",
                    key:'sgl',
                    value:'sgl',
                    icon:''
                },
                {
                    label:"搜周边",
                    key:'szb',
                    value:'szb',
                    icon:''
                },
                {
                    label:"多媒体",
                    key:'dmt',
                    value:'dmt',
                    icon:''
                }
            ],
            slortoptions:[],
            sloretype:'ASC', //DESC:降序   ASC:升序
            parmise:null,
            checkboxlist:[],
            listpar:null,
            featurelist:[],
            pointlist:[],
           
        }
    },
    computed:{
        slyspar(){
        //    this.parmise = this.$store.state.menuData.slyspar
            return this.$store.state.menuData.slyspar;
        },
        formdata(){
            return this.$store.state.menuData.formdata;
        }
    },
    watch:{
        slyspar(newval,oldval){
            this.parmise = newval
           
            this.serachbtn()
        },
        activeroleson(newvl,oldval){
            this.$store.dispatch('setactiverole',newvl)
        },
        formdata(newvl,oldval){
             
             let activeobj = null
             if(this.activeroleson){
                 activeobj = this.activeroleson
             }else{
                 activeobj = this.checkboxlist[0]
             }
            this.radioClick(activeobj)
        }
    },
    mounted(){
        this.parmise = this.$store.state.menuData.slyspar
        this.$nextTick(()=>{
           
        });
    },
    methods:{
        // 返回按钮点击事件
        fanhuiClick(){
            if(this.showlist){
                this.mapclear()
                this.$emit('showmoudlechange', true);
                this.$store.dispatch("setactiverole", null);
                var par = { 
                        pageNo:1,
                        pageSize:10,
                        data:[],
                        serachname:'',
                        spaceCode:'',
                        order:{
                            tableField:'',
                            orderType:''  
                        },
                        tableNames:''
                    }
                this.$store.dispatch('setslyspar',par)
                
            }else{

                this.$refs.particulars.particularslist = []
                this.showlist = true
                this.headertitle='列表展示'
            }
            
        },
        // tab切换的事件
        radioClick(row){
           if(this.$refs.creatfromyslx){
               this.$refs.creatfromyslx.resedFormModelFn()
           }
           this.$store.state.menuData.tjfxactiverole = row
            this.activeroleson = row;
            this.$refs.Pagination.currentPage = 1
            this.parmise.spaceCode = row.spaceCode
            this.fromSq()
            // this.parmise.data = []
            this.parmise.pageNo = 1
            this.$store.dispatch('setslyspar',this.parmise)
            let Conditionpar={
                spaceCode:this.parmise.spaceCode,
            }
            this.getactiveroleCondition(Conditionpar)
                    
        },
         // 搜索按钮点击事件调用搜索
        serachbtn(){
            let par =  this.parmise
            this.getselectDynamic(par)
            this.$store.dispatch('setslyspar',par)
        },
        // 排序方式的切换
        sloretypechange(sorttype){
            this.sloretype = sorttype
            this.parmise.order.orderType = sorttype
            this.parmise.pageNo = 1
            this.$refs.Pagination.currentPage = 1
            this.creatlistpramise()
        },
        doubleup(){
            this.fromisshow = true;
        },
        // 收起
        fromSq(){
               
                
        },
        // 排序指标切换事件
        slortvaluechange(val){
            for(var i=0;i<this.slortoptions.length;i++){
                if(this.slortoptions[i].value == val){
                    this.sloretype = this.slortoptions[i].ordertype
                }
            }
            let order={
                orderType : this.sloretype,
                tableField : this.slortvalue
                }
            this.parmise.pageNo = 1
            this.$refs.Pagination.currentPage = 1
            this.parmise.order = order
            this.creatlistpramise()
        },
        // 根据选中的对象弹出搜索配置面板
        showsearch(){
           if(this.fromisshow){
            // 表单显示
            this.fromisshow = false;
            this.$nextTick(()=>{
                
                if(this.$refs.creatfromyslx){
                    // 重置from表单 
                    this.$refs.creatfromyslx.resedFormModelFn()
                }
           
            })
           }
        },
         // 搜索水利对象数据
        getselectDynamic(par){
            this.mapclear()
            let getalltablenamepar ={
                serachname: this.parmise.serachname,
                data: this.parmise.data,
                tableNames: this.parmise.tableNames,
                spaceWkt: this.parmise.spaceWkt
                }
            getAllTableName(getalltablenamepar).then((res)=>{
                if(res.msg == '执行成功'){
                    this.checkboxlist = res.allTableName
                    for(var i=0;i<res.allTableName.length;i++){
                        if(res.allTableName[i].spaceCode == res.currentTableName){
                             this.radioClick(res.allTableName[i])
                        }
                    } 
                }
            })
        },
        // 获取列表数据
        getlistdata(par){
            selectDynamic(par).then((res)=>{
                this.objcloument= res.cloument
                this.resdatalist = res.data.list
                this.total=res.data.total
                let that = this
                let isupdata = true
                 var promiseArray = [];
                for(var i=0;i<res.data.list.length;i++){
                    let row = res.data.list[i];
                    let Geopar = new Object
                    Geopar.objCode = row.obj_code;
                    Geopar.spaceCode = that.parmise.spaceCode
                    let isend = false
                    if(i==(res.data.list.length-1)){
                        isend = true
                    }
                    if(row.center_x && row.center_y){
                         let objcenter = [row.center_x , row.center_y]
                         that.ceratmappoint(objcenter,row.obj_code,i,row)
                    }
                }
                 mapUtil.createLayer(that.pointlist,'tspoints',6,null,'Geojson'); //添加图层

                    })
        },
        // 获取选中的水利对象的排序数据
        getactiveroleCondition(par){
            this.slortoptions = []
            this.slortvalue = ''
            getTableFieldOrder(par).then((res)=>{
                if(res.data && res.data.length !=0){
                    this.sloretype = res.data[0].ordertype
                    let lsits = res.data
                    let cloument = res.cloument
                    for(var i=0;i<lsits.length;i++){
                      for(var j=0;j<cloument.length;j++){
                          if(lsits[i].tablefield ==cloument[j].attName){
                                let obj = new Object
                                obj.label= cloument[j].alias
                                obj.value = lsits[i].tablefield
                                obj.ordertype = lsits[i].ordertype
                                this.slortoptions.push(obj)
                                
                          }
                      }
                    }
                    this.slortvalue =  this.slortoptions[0].value
                    let order={
                        orderType : this.sloretype,
                        tableField : this.slortvalue
                    }
                    this.parmise.order = order
                    this.creatlistpramise()
                }else{
                    let order={
                        orderType : '',
                        tableField : '',
                    }
                    this.parmise.order = order
                    this.creatlistpramise()
                }
            })
        },
        // 设置请求列表数据参数
        creatlistpramise(){
            let par ={
                pageNo:this.parmise.pageNo,
                pageSize:this.parmise.pageSize,               
                data:this.parmise.data,
                spaceCode:this.parmise.spaceCode,
                serachname:this.parmise.serachname,
                order:this.parmise.order,
                spaceWkt:this.parmise.spaceWkt,
            }
            
            this.objcloument= []
            this.mapclear()
            this.getlistdata(par)
        },
        //分页器的页面发生变化
        pageNochange(val){
             this.parmise.pageNo = val
             this.creatlistpramise(this.parmise)
        },
        // 获取列表的空间数据并进行展示
        getmapgetGeo(par){
            let that = this
            return new Promise((resolve,reject)=>{
                getGeo(par).then((res)=>{
                    if(res.data && res.data.smgeometry !=''){
                        that.ceratmapfeater(res.data.smgeometry,res.data.obj_code)
                    }else{
                       
                    }
                    resolve()  
                })
          })
        },
        // 创建图层
        ceratmapfeater(data,id){
            
            let geodata = JSON.parse(data)
          
            let styleObj = {
                circle: "",
                fill: "rgba(13,158,196,0.3)",
                stroke: "rgba(29,182,221)",
                line: 4
                };
                let featureold = mapUtil.createGeoJsonFeature(geodata)
                featureold[0].id = id
                featureold[0].setStyle(mapUtil.setStyle(styleObj))
                mapUtil.createLayer(featureold,'listmaprow',2,null,'Geojson'); //添加图层
            
        },
        // 添加中心点位展示
        ceratmappoint(pointgeo,nameid,index,e){

            let  pointmap = mapUtil.createFeature('point',nameid,pointgeo)
         
            let pointurl = require('../../assets/jinglingpng/blue-'+ (index+1) + '.png')
            let pointstyleObj = {
                icon: pointurl,
                scale: 0.6,
                rotateWithView:true,
                text:this.resdatalist[index].obj_name,
                    // 字体颜色 默认黑色
               textColor:this.textColor,
                };
                pointmap.setStyle(mapUtil.setStyle(pointstyleObj))
                pointmap.name = nameid
                pointmap.index = index
                pointmap.attribute = e

               this.pointlist.push(pointmap)
             
        },
        // 列表地图定位
        mapbtns(row,index){    
            mapUtil.clearLayer('listmaprow') 
            if(this.ismapobj){
                 let lastfeatureobj = this.filtermaplay(this.ismapobj)
                this.pointtobule(lastfeatureobj,this.ismapobjindex)
            }
            this.ismapobj = row
            this.mapRed = index
            this.ismapobjindex = index
            let featureobj = this.filtermaplay(row)
            this.pointtored(featureobj,index)
            let center = [row.center_x,row.center_y]
            let Geopar = new Object
            Geopar.objCode = row.obj_code;
            Geopar.spaceCode = this.parmise.spaceCode
            this.getmapgetGeo(Geopar).then(()=>{
                mapUtil.setcenter(center,14)
            })
            
},
        // 详情展示按钮
        btnitem(row){
            let arr = this.objcloument
            for(var i=0;i<arr.length;i++){
                let data = arr[i]
                if(data.dictionaries && data.dictionaries.length!=0){
                    for(var j=0;j<data.dictionaries.length;j++){
                        if(row[data.attName] == data.dictionaries[j].code){
                            arr[i].value = data.dictionaries[j].name
                        }
                    }
                    if(!arr[i].value){
                        arr[i].value = '空'
                    }
                }else{
                    arr[i].value = row[data.attName]
                }
            }
            this.$refs.particulars.particularslist = arr
            this.headertitle = arr[0].value+'详情'
            this.moudletypebtn(this.moudlelist[0])
            this.showlist = false
        },
        // 详情展示展示类型切换事件
        moudletypebtn(row){
            this.activemoudle = row
        },
        //初始化地图
        mapclear(){
            mapUtil.clearLayer('tspoints')
            mapUtil.clearLayer('listmaprow')
            this.resdatalist = []
            this.featurelist = []
            this.pointlist = []
            this.ismapobjindex = null
        },
        filtermaplay(row){
            let activeobj = null
            let activefeature = null
             let layer = mapUtil._mapInstance.getLayers().getArray()
            for (var i=0;i<layer.length;i++){
                if(layer[i].name =='tspoints'){
                    activeobj = layer[i]
                }
            }
            let featurelist = activeobj.getSource().getFeatures()
            for(var j=0;j<featurelist.length;j++){
                if(featurelist[j].name==row.obj_code){
                    activefeature = featurelist[j]
                }
            }
            let featuretype ={
                "activefeature" : activefeature
            }
            return  featuretype
        },
        //图标滑过滑出事件
        changeMask(index,ishover,row){
           let featureobj = this.filtermaplay(row)
            if(ishover){
             this.pointtored(featureobj,index)
            }else {
                this.pointtobule(featureobj,index)
               
            }
        },
        // 将地图图标改成红色
        pointtored(featureobj,index){
           
            if(featureobj && featureobj.activefeature){
                    let pointurl = require('../../assets/jinglingpng/red-'+ (index+1) + '.png')
                    
                  let pointstyleObj = {
                        icon: pointurl,
                        scale: 0.6,
                        rotateWithView:true,
                        text:this.resdatalist[index].obj_name
                    };
                     featureobj.activefeature.setStyle(mapUtil.setStyle(pointstyleObj))
            }
        },
        pointtobule(featureobj,index){
            if(featureobj && featureobj.activefeature){
                    let pointurl = require('../../assets/jinglingpng/blue-'+ (index+1) + '.png')
                    let pointstyleObj = {
                        icon: pointurl,
                        scale: 0.6,
                        rotateWithView:true,
                        text:this.resdatalist[index].obj_name
                    };
                    featureobj.activefeature.setStyle(mapUtil.setStyle(pointstyleObj))
            }
        }
    }
}
</script>

<style scoped>
.fanhuicion{
    margin-right: 5px;
    font-size:23px;
    height: 40px;
    width: 40px;
    text-align: center;
    border-radius: 6px;
    background: rgba(0,0,0,.7);
    display: flex;
    align-items: center;
    justify-content: center;
}
.factor-warp{
    display: flex;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 15px 5px 5px 5px;
}
.factor{
    width: 100%;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    /* justify-content: space-around; */
    
}
.factor li{
    color: #fff;
    font-size: 16px;
    width: 112px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    list-style: none;
    cursor: pointer;
    text-shadow: rgb(0 166 124) 0px 0px 1.04167vw;
    border-radius: 6px;
    box-shadow: rgb(0 113 241) 0px 0px 0.26042vw;
    padding: 5px 5px;
    margin: 0 6px 10px 6px;
    background: rgba(0, 0, 0, .5);
}
.factor .isactive{
    box-shadow: #F17408 0px 0px 0.26042vw;
    color: #F17408;
}
.factor .noactive{
    /* background: rgba(12,152,237,.65);
    border-color: rgba(12,152,237,.65); */
    
}
.isstart{
    justify-content: flex-start;
}
.isstart li{
    margin-right: 20px;
}
.searchswich{
    margin-right: 5px;
}
.listfooter{
    height:50px;
    width:100%;
    padding:0 5px
}
.warpcomend{
    width: 100%;
    padding: 0;
    margin: 0;
}
.onetabheight{
    height: calc(100% - 140px);
}
.anytabheight{
    height: calc(100% - 190px);
}
</style>

<style scoped>
/* 收起 */
.matbspanysq{
display: flex;
justify-content: center;
cursor: pointer;

}
.matbspanysq span{
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: normal;
}
.matbspanysq .fa{
    color:#0C7EEE;
    font-size: 25px;
    margin-right: 10px;
}
.listrowshow{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    flex-wrap: wrap;
    overflow-y: auto;
    align-content: flex-start;
}
.listrowshow-lis{
    width: 100%;
    position: relative;
    height: 50px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.listrowshow-logo{
    position: relative;
    height: 100%;
    width: 55px;
    background-image:url('../../assets/image/numbg.png');
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: 700px 400px;
    cursor: pointer;
}
.listrowshow-logo>span{
    color: #fff;
    font-size: 18px;
    font-family: lcd;
    font-weight: bold;
}
.listrowshow-conent{
    width: 60%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
}
.listrowshow-conent>span{
    width: 100%;
    color: #fff;
    margin-top: 14px;
}
.listrowshow-btns{
     width: calc(40% - 60px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.mapcion{
    font-size: 24px;
    color: #0B629F;
    cursor: pointer;
    margin: 0 5px;
}
.mapactivebtn{
    color: #d04a0e;
}
.mapcion:hover{
    color: #d04a0e;
}
</style>


<style scoped>
.xiangqingvar{
    width: 100%;
    height: calc(100% - 120px);
}
.moudlebtns{
    height: 80px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-around;
    padding-top: 10px;

}
.moudlebtns>li{
      font-size: 16px;
    width: 110px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    list-style: none;
    cursor: pointer;
    text-shadow: rgb(0 166 124) 0px 0px 1.04167vw;
    border-radius: 6px;
    padding: 5px 5px;
    margin: 0 5px 10px 5px;
    background: rgba(0, 0, 0, 0.5);
}
.isactivebtntype{
    color: #E5821E;
    border-radius: 6px;
}
</style>
