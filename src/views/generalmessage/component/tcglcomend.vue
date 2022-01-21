<template>
    <div class="tcgl-warp right-moudle">
        <div class="close-warp">
            <div class="sousuo-warp">
                <i class="iconfont icon-layer"></i>
                <span>图层管理</span>
            </div>
            <i class="el-icon-s-unfold closei" @click="tcglbtnclose('tcgl')"></i>
        </div>

        <div  class="warp-comnde hasearch">
             <el-input placeholder="请输入内容" @change='inputchanges' v-model="inputvalue" clearable class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="treesearch"></el-button>
            </el-input>
            <tree :treelists='treedata' />
           
        </div>
    </div>
</template>

<script>
import treedata from '../../../../public/data/tree.json'
import mapUtil from "@/utils/Openlayer-utils";
import axios from 'axios'
import {roleLayerTreeselect,getServerList}  from '@/api/generalmessage/index.js'
import slider from '@/components/slider/index'
import tree from '@/components/tree/index'
export default {
    name:'tcglcomend',
    components:{
        slider,tree
    },
    data(){
        return{
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            treedata:[],
            expandeddata:[],//树结构默认展开的
            checkeddata:[],//复选框选中的数组
            tcindex:2, //初始化图层的层级
            cscheckList:[],// 测试的图层
            cscheckListac:[],//测试数据
            responsesd:null,//测试数据
            per:0,
            inputvalue:'',//输入框绑定值
            parmise:{
                LayerName:''
            },
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
        }
    },
    mounted(){
        // this.treedata = treedata
        this.gettreedata()
        this.$nextTick(function () {
            // 通过key设置默认选中的节点
            // this.setCheckedKeys([])
        });
    },
    computed:{
        isclearmap(){
           
            return this.$store.state.menuData.isclearmap;
        }
    },
    watch:{
        isclearmap(newvla,oldval){
            this.tcindex = 2
            this.parmise.LayerName = ''
        }
    },
    methods:{
        // 关闭面板方法
        tcglbtnclose(str){
            this.$emit('clreamoudlevalue',str);
        },
        // 搜索框搜索按钮
        treesearch(){
           this.inputchanges(this.inputvalue)
            
        },
        // 输入框值发生变化
        inputchanges(value){
            this.parmise.LayerName = value
            this.gettreedata(this.parmise)
        },
        // 获取树状数据
        gettreedata(par){
            getServerList(par).then((res)=>{
                if(res.code == 200){
                    // 设置默认展开的数据
                  
                    this.treedata = res.layers
                }
            })
        },

    }
}
</script>

<style scoped>
.tcgl-warp{
    width: 400px;
    height: 650px;
}
.tcgl-warp-header{
    display: flex;
    height: 45px;
    align-items: center;
    justify-content: space-between;
}
.tcgl-warp-header-logo{
    display: flex;
    height: 100%;
    width: 35%;
    background: rgba(8, 13, 25, 0.87);
    align-items: center;
    justify-content: flex-start;
    color: #fff;
    font-size: 16px;
}
.tcgl-warp-header-logo i{
    margin-right: 5px;
    color: #d04a0e;
    font-size: 26px;
}
.swiperclass{
    position: relative;
    width:95%;
    background: rgba(172,174,176,.5);
    border-radius: 4px;
    /* height: 30px; */
    display: flex;
    align-items: center;
    padding: 0 5px 10px 0;
    flex-wrap: wrap;
}
.mapstyles{
    display: flex;
    align-items: center;
}
.hasearch{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    /* align-content: flex-start; */
}
</style>


<style  lang="scss">
/*
设置树状结构第一层不显示复选框，其余层级显示复选框的样式调整\

*/
#unSchTree .el-tree > .el-tree-node > .el-tree-node__content .el-checkbox {

  display: none;

}
#unSchTree .el-tree-node__content label.el-checkbox {
//   display: none;
}
#unSchTree .el-tree-node__children label.el-checkbox {
  display: inline-block;
//   margin-left: -17px;
}
.el-tree-node__expand-icon{
    font-size: 16px;
}
.fontfastyle{
    color: #fff;
    font-size: 16px;
}

</style>