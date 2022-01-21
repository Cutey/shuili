<template>
  <div class="yscomend searchcomend">
    <div class="yscomed-warp" v-if="showsearch">
      <div class="omeystab tabsome" :class="isactivetab=='onetab'?'isactivetab':''" @click="tabClick('onetab')">
        <span class="tabspan" >单一要素</span>
      </div>
       <div class="anyystab tabsome" :class="isactivetab=='anytab'?'isactivetab':''" @click="tabClick('anytab')">
        <span class="tabspan">多类要素</span>
      </div>
      <div class="close-warp">
        <div class="sousuo-warp">
          <i class="iconfont icon-zhanshi"></i>
          <span>搜索面板</span>
        </div>
        <i class="el-icon-s-fold closei" @click="btnclose('A')"></i>
      </div>
      <div class="warp-comnde">
          <yslbone v-show="isactivetab=='onetab'" ref="yslbone" @searchchange='searchchange' />
          <yslbany v-show="isactivetab=='anytab'" ref="yslbany" @searchchange='searchchange' @showmoudlechange='showmoudlechange' />
      </div>
    </div>
    <div class="yscomed-warp" v-else>
      <listshow @showmoudlechange='showmoudlechange' :isactivetab='isactivetab' ref="listshow" />
    </div>
  </div>
</template>

<script>
import yslbone from './yslbone' //单一要素组建
import yslbany from './yslbany' //多要素查询组建
import listshow from '@/components/listshow/index'
export default {
  name: "yslbcommed",
  components:{
    yslbone,yslbany,listshow
  },
  data() {
    return {
      isactivetab:'onetab',
      showsearch:true
    };
  },
  mounted() {
    this.$nextTick(() => {

    });
  },
  methods: {
    btnclose(val) {
      this.$emit("btncloses", val);
    },
    tabClick(str){
      this.isactivetab = str
      let par = this.$store.state.menuData.slyspar
      par.tableNames = ''
      par.data = []
      this.$store.dispatch('setslyspar',par)
      if(str=='onetab'){
       this.$refs.yslbone.resetactivechange()
      }else{
        this.$refs.yslbany.resetactivechange()
      }
    },
    // 详情面板与搜索面板的展示切换
    showmoudlechange(isshow){
      this.showsearch = isshow
    },
    // 搜索按钮点击事件
    listsearch(){
      this.$nextTick(()=>{
        this.$refs.listshow.serachbtn();
     
      });
    },
       // 切换按钮点击事件
    listCut(){    
        this.$refs.listshow.radioClick()     
    },
    // 热门搜索和历史搜索点击后的事件执行方法
    listsearchchange(){
      this.showsearch = false
      this.listsearch()
    },
    // 热门搜索和历史搜索点击后的事件执行方法
    searchchange(str){
      this.$emit('ipntuchanges', str);
    }
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

</style>