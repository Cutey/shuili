<template>
  <div class="sondiv">
    <soumian @listsearchchange="listsearchchange" />
    <!-- 水利对象 -->
    <div class="shuili-comed">
      <div class="warp-header">
        <div class="warp-header-right">
          <div class="headerlist"></div>
          <span>要素类型</span>
        </div>
         <el-button  size="mini" type="text" style="font-size: 16px;" v-show="isactivetab"  @click="resetactivechange">重置</el-button>  
      </div>
      <ul class="history-warp hasbottomhistory"  v-show="fromisshow" >
        <Rolelist
          :checktype="checktype"
          @radioClick="radioClick"
          ref="Rolelist"
        />    
      </ul>
           <div class="testscrollbar fromWrap"  style="height:80%;overflow-y: auto;" v-if="!fromisshow" >
              <creatfrom class="fromheight" @doubleup='doubleup' ref="creatfromyslx" />
      </div>
      <div class="matbspanyslx" v-show="showform == 1"  >
        <span style="color: #fff; margin: 0 auto;line-height: normal;display: flex;align-items: center;" @click="moreEchars"
          ><i class="fa fa-angle-double-down"></i>更多</span
        >
      </div>
      <div  class="matbspanyslx" @click="doubleup" v-show="showform == 2" style="margin-top:5px">
          <span style="color:#fff;line-height: normal;display: flex;align-items: center;"><i class="fa fa-angle-double-up"></i>收起</span>
      </div>  
    </div>
  </div>
</template>

<script>
import Rolelist from "@/components/factorobject/index";
import soumian from "./soumian";
import creatfrom from "./creatfrom";

export default {
  name: "yslbone",
  props: {},
  components: {
    Rolelist,
    soumian,
    creatfrom,
  },
  data() {
    return {
      checktype: "radio",
      popularList: [], //热门搜索数据
      // 收起更多按钮显示
      showform: 0,     
      // 表单显示
        fromisshow: true,
        isactivetab:null,
    
    };
  },

  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    //  要素组建传过来的方法， row为点击的要素信息
    radioClick(row) {
      this.isactivetab = row
      this.showform = 1;
    },
     // 更多
    moreEchars() {
      // 表单显示
      this.fromisshow = !this.fromisshow;
     
      // 按钮显示
      this.showform = 2;
   
    },
    // 收起
    doubleup(){
        this.fromisshow = !this.fromisshow;
        this.showform = 1;
    },
    // 要素列表重置
    resetactivechange() {
      this.isactivetab = null
      this.showform = 0
      this.fromisshow = true
      if (this.$refs.Rolelist) {
        this.$refs.Rolelist.resetactive();
      }
         
    },
   
    //  热门搜索和最近搜素内容点击事件
    listsearchchange(str) {
      this.$emit("searchchange", str);
      
    },
  },
};
</script>
<style scoped>
.hasbottomhistory{
  height: calc(100% - 75px)
}
.matbspanyslx{
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
  cursor: pointer;
  height: 30px;
}
.matbspanyslx .fa{
    color: #0C7EEE;
    font-size: 25px;
    margin-right: 10px;

}

</style>

