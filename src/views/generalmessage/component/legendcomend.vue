<template>
    <div class="tcgl-warp right-moudle">
        <div class="close-warp">
            <div class="sousuo-warp">
                <i class="iconfont icon-layer"></i>
                <span>图例展示</span>
            </div>
            <i class="el-icon-s-unfold closei" @click="tcglbtnclose('tlzs')"></i>
        </div>

        <div  class="warp-comnde hasearch">
         
            <legthtree />
           
        </div>
    </div>
</template>

<script>
import mapUtil from "@/utils/Openlayer-utils";
import legthtree from '@/components/legthtree/index'
export default {
    name:'legendcomend',
    components:{
        legthtree
    },
    data(){
        return{

        }
    },
    mounted(){
        this.$nextTick(function () {

        });
    },
    computed:{
        isclearmap(){
           
            return this.$store.state.menuData.isclearmap;
        }
    },
    watch:{
        isclearmap(newvla,oldval){
          
        }
    },
    methods:{
        // 关闭面板方法
        tcglbtnclose(str){
            this.$emit('clreamoudlevalue',str);
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