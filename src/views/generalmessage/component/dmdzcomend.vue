<template>
     <!-- 地名地址展示模块 -->
    <div class="dmdzcomend searchcomend">
        <div class="close-warp">
            <div class="sousuo-warp">
                <i class="iconfont icon-zhanshi"></i>
                <span>搜索面板</span>
            </div>
            <i class="el-icon-s-fold closei" @click="btnclose('B')"></i>
        </div>

        <div class="warp-comnde" >
            <!-- 数据来源模块 -->
            <div class="history-comed warp-comden" style="height:35%">
                <div class="warp-header">
                    <div class="warp-header-right">
                        <div class="headerlist"></div>
                        <span>数据来源</span>
                    </div>
                </div>
                <ul class="history-warp"></ul>
            </div>

            <!-- 数据范围模块 -->
            <div class="history-comed warp-comden-noborder">
                <div class="warp-header">
                    <div class="warp-header-right">
                        <div class="headerlist"></div>
                        <span>数据范围</span>
                    </div>
                </div>
                <ul class="history-warp"></ul>
            </div>

        </div>

    </div>
</template>

<script>
export default {
    name:'dmdzcomend',
    data(){
        return{

        }
    },
    mounted(){

    },
    methods:{
        btnclose(val){
            this.$emit('btncloses', val);
        }
    }
}
</script>

<style scoped>
.dmdzcomend{
    height: 400px;
    box-shadow: 0 0 10px 3px rgb(20 142 195 / 80%);
}
.headerlist {
  width: 2px;
  height: 20px;
  background: #d85d0f;
  margin: 0 10px 0 0;
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


</style>