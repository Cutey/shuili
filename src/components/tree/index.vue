<template>
    <div class="tree-row testscrollbar">
        <ul class="tree-warp ">
            <li  v-for="item in treelists" :key="item.id" class="tree-lis">
               <div class="tree-lis-check">
                    <div>
                        <i class="fa fa-folder faiconfonts"  v-if="item.children" v-show="!item.showChildren" @click="showChildrenclick(item)"></i>
                        <i class="fa fa-folder-open faiconfonts" style="color:#22E13C" v-if="item.children" v-show="item.showChildren" @click="showChildrenclick(item)"></i>
                        <i class="fa fa-tag fontfastyle" style="color:#19A2C9" v-if="!item.children"></i>
                        <span>{{item.layerName}}</span>
                    </div>
                     
                    <div class="iconsfastuyle" :class="!item.children && item.checkbox ? 'haschildren':'nohaschildren'">
                       <el-checkbox v-model="item.checkbox" style="margin-right: 10px;" @change="featureChange(item.checkbox,item)" ></el-checkbox>
                       <span style="" class="stylemapserverspan" :class="item.showswiper?'isopen':'isup'" v-if="!item.children && item.checkbox" @click="item.showswiper = !item.showswiper">
                           样式控制
                         <i class="fa fa-chevron-down fontfastyle" v-show="!item.showswiper" ></i>
                         <i class="fa fa-chevron-up fontfastyle"  v-show="item.showswiper"></i>
                       </span>
                       <i class="fa fa-share-alt fontfastyle sharestyleicon" title="分享"  v-if="!item.children && item.checkbox && item.path !=''" ></i>
                       
                       
                    </div>
                    <div class="featurestyle" v-show="item.showswiper">
                        <div style="width:100%" class="mapstyles">
                            <span >透明度</span>
                            <slider @input='inputchange' :datarow='item' :min=0 :max=100 :value=100  v-model = "pernum"  v-if="item.showswiper"></slider>
                        </div>

                        <div style="width:100%;" class="mapstyles"  v-show="item.dataType !='Point'">
                             <span>边框颜色</span>
                             <el-color-picker
                                v-model="item.stroke"
                                show-alpha
                                :predefine="predefineColors"
                                @change='mapcolorchange(item.stroke,item,"stroke")'
                                >
                            </el-color-picker>
                        </div>

                        <div style="width:100%;" class="mapstyles" v-show="item.dataType !=='LineString'">
                             <span>填充颜色</span>
                             <el-color-picker
                                v-model="item.fill"
                                show-alpha
                                :predefine="predefineColors"
                                @change='mapcolorchange(item.fill,item,"fill")'
                                >
                            </el-color-picker>
                        </div>

                        <div style="width:100%;margin-top:10px" class="mapstyles" v-show="item.dataType !='Point'"> 
                             <span style="margin-right:5px;width:50px">线宽</span>
                             <el-input-number v-if="item.style" v-model="item.style.line" size="mini" @change="handleChange(item.style.line,item)" :min="1" :max="12"></el-input-number>
                        </div>
                    </div>

                </div>
                <tree :treelists='item.children' v-if="item.children" v-show="item.showChildren"></tree>
            </li>
        </ul>
    </div>
</template>

<script>
// import treelist from '../../../public/data/tree.json'
import mapUtil from "@/utils/Openlayer-utils";
import slider from '@/components/slider/index'
import {getlendlist} from '@/api/generalmessage/index.js'
export default {
    name:'tree',
    components:{
        slider,
    },
    props:{
        treelists:{
            type:Array,
            default:()=>{
                return []
            },
        }
    },
    data(){
        return{
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
            legendlist:[],
            pernum:'1'

        }
    },
    computed:{
        isclearmap(){
            return this.$store.state.menuData.isclearmap;
        },
        legthlist(){
            return this.$store.state.menuData.legthlist;
        }
    },
    watch:{
            isclearmap(newvla,oldval){
                 this.recursiondata(this.treelists,false)
            },
    },
    mounted(){
       
        this.$nextTick(()=>{
        });
    },
    methods:{
        // 是否展示子元素的切换事件
        showChildrenclick(row){
            row.showChildren = !row.showChildren
        },
        // 图例展示
        showlendclick(row){
            getlendlist(row.serverId).then((res)=>{
                if(res.msg=='操作成功'){
                    row.lendlist = res.pictures
                    for(var i=0;i<row.lendlist.length;i++){
                        row.lendlist[i].imgurl = process.env.VUE_APP_FILE_API+ row.lendlist[i].uploadImage
                    }
                    let obj = {
                        lendlist :row.lendlist,
                        label:row.label,
                        checkbox:row.checkbox,
                        showlend:false,
                        id:row.id
                    }
                    if(res.pictures&& res.pictures.length !=0){
                        this.legendlist =  this.$store.state.menuData.legthlist
                        this.legendlist.push(obj)
                        this.$store.dispatch('setlegthlist',this.legendlist)
                    }
                    
                }
            })
        },
        // 图层选中框的change事件
        featureChange(ischeck,row){
            this.recursiondata([row],ischeck)
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
            data.feature.setStyle(mapUtil.setStyle(data.style));
            }else{
                //  row.feature=mapUtil.wmsTileLayer(url,leavername,name,leaver,)
            }
        },
        // 改变地图服务透明度
        inputchange(val,row){
            row.feature.setOpacity(val)
        },
        //递归数组
        recursiondata(data,isadd){
            let flag = true;
            let that = this
            function judgeChildren(data) {
                data.forEach(e => {
                    if (!flag) {
                        return
                    }
                     e.checkbox = isadd
                    if (e) {
                        if(isadd){ 
                           
                            if(!e.children && e.isServer){
                                that.showlendclick(e)
                            }
                            that.addmapserver(e)
                         
                           
                        }else{
                            if(!e.children){
                                that.deletedlend(e)
                            }
                            if(e.isServer){
                                 mapUtil.clearLayer(e.serverId)
                            }
                           
                            e.feature = null
                            e.showlend = false
                            e.pernum = 0
                            e.showswiper = false
                            e.style = null
                            
                        }
                        
                    } 
                    if (e.children && e.children.length !=0) {
                        judgeChildren(e.children);
                    }
                });
            }
            judgeChildren(data);
            return flag;
        },
        deletedlend(row){
            let data = this.$store.state.menuData.legthlist
            if(data && data.length!=0){
                for(var i=0;i<data.length;i++){
                    let item = data[i]
                    if(item.id==row.id){
                        data.splice(i,1)
                    }
                }
                this.$store.dispatch('setlegthlist',data)
            }
            
        },
        addmapserver(row){
            let url= row.serverUrl
            let name = row.serverId
            let leaver = this.tcindex
            let leavername = row.serverName
            this.tcindex ++
            row.pernum = 1
            row.feature = null
            // 将添加的图层的图层名称push到vuex的数组中，方便其他组建删除图层
            if(row.serverType == 'WVT'){
                 row.feature=mapUtil.createWVTLayer(url,name)
                 row.style = {
                        stroke: row.stroke,
                        fill: row.fill,
                        line:row.line,
                    }
                if(row.dataType=='Point'){
                     row.style.circle = row.fill
                }
                 row.feature.setStyle(mapUtil.setStyle(row.style));
                   mapUtil._mapInstance.addLayer(row.feature);
            }else{
                 row.feature=mapUtil.wmsTileLayer(url,leavername,name,leaver,)
            }
        },
         //改变地图服务的线宽
        handleChange(val,data){
        if(data.layerType == 'WVT'){
            data.line = val
            data.style.line = val
            data.feature.setStyle(mapUtil.setStyle(data.style));
            }else{
                //  row.feature=mapUtil.wmsTileLayer(url,leavername,name,leaver,)
            }
        }
    }
}
</script>


<style scoped>
.tree-row{
    width: 100%;
    height: 89%;
    padding: 0 0px 0 6px;
    overflow-y: auto;
}
.tree-warp{
    width: 100%;
}
.tree-lis{
    display: flex;
    justify-content: space-between;
    color: #fff;
    flex-wrap: wrap;
}
.tree-lis i{
    cursor: pointer;
}
.fontfastyle{
    color: #ccc;
    font-size: 12px;
}
.tree-lis-check{
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 10px;
}
.featurestyle{
    /* height: 140px; */
    width: 99%;
    margin-top: 7px;
    background: rgba(220,218,193, .3);
    border-radius: 4px;
    padding: 5px 10px;
    overflow-x: auto;
    overflow-y: hidden;
}
.iconsfastuyle{
    display: flex;
    align-items: center;
    width: 33%;
}
.nohaschildren{
    justify-content: flex-end;
}
.haschildren{
    justify-content: flex-start;
}
.faiconfonts{
    color: #F8A30B;
}
.stylemapserverspan{
    font-size:10px;
    margin-right: 5px;
    cursor: pointer;
    
}
.stylemapserverspan:hover{
    color: #EA810E;
}
.sharestyleicon{
    font-size: 15px;
    color: #EA9F0E;
    margin-right:0 6px;
}
.mapstyles{
    display: flex;
    align-items: center;
}
.mapstyles>span{
    font-size: 14px;
    width: 80px;
}
.lendclasslse{
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.lendclasslse>li{
    height: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* margin-right: 7px; */
}
.lendclasslse>li .pointimg{
  height: 20px;
    width: 20px;
}

.lendclasslse>li .lineimg{
  height: 10px;
    width: 50px;
}

.lendclasslse>li span{
    width:75px;
    font-size: 14px;
    text-align: center;
}
.isopen{
    color: #EA810E;
}
.isup{
    color: #0EB9EA;
}
</style>