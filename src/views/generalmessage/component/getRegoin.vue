<template>
<!-- 快速定位行政区模块 -->
    <div class="getRegoin-warp">
        <el-breadcrumb separator="/" class="citytabs">
            <el-breadcrumb-item v-for="item in citylist" :key="item.code" style="color:#fff" v-show="citylist.length !=0" @click="breadcrumbclick(item)">{{item.fRegionName}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="getRegoin-warp-comend">
            
        </div>
       
    </div>
</template>

<script>
import {getRegoin} from '@/api/generalmessage/index.js'
export default {
    name:'getRegoin',
    data(){
        return{
            citylist:[
                {
                    centerx: 117.334,
                    centery: 39.2928,
                    fId: "029a4a69e75e4d43922295d2a68fa9cb",
                    fLevel: 0,
                    fParentRegionCode: "0",
                    fPingyin: "",
                    fRegionCode: "120000",
                    fRegionName: "全国",
                    lx: "116.702",
                    ly: "38.5548",
                    objectids: 31,
                    rx: "118.059",
                    ry: "40.251",
                    seAnnoCadData: "31323437342e3635353735383231313833",
 
                }
            ],
            pramise:{
                fLevel:'1',
                fParentRegionCode:'0',
                fRegionCode:''
            },
            fatherlist:[]
        }
    },
    mounted(){
        this.$nextTick(() =>{
            this.getRegoin(this.pramise)
        });
    },
    methods:{
        // 获取行政区数据
        getRegoin(par){
            getRegoin(par).then((res)=>{

                this.fatherlist = res.data
            })
        },
        // 节点点击事件
        breadcrumbclick(row){
    
        }
    }
}
</script>

<style scoped>
.getRegoin-warp{
    height: calc(100% - 45px);   
    padding: 0;
    margin: 0;
    overflow-y: auto;
}
.citytabs{
    height:  50px;
    display: flex;
    align-items: center;
    color: #fff;
}
.getRegoin-warp-comend{
    height: calc(100% - 45px);   
    padding: 0;
    margin: 0;
    overflow-y: auto;
}
</style>