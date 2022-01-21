<template>
  <div id="creatfrom-wrap">
        <div class="testscrollbar fromWrap"  style="height:90%;overflow-y: auto;">
        <creatfrom class="fromheight" ref="creatfrom" />
      </div>
<div class="buttonWrap">
    <el-button size="mini" type="primary" style="margin:0 auto"  @click="submitFrom">确定</el-button>  
    <el-button size="mini"  style="margin:0 auto"  @click="resedFormModelFn">重置</el-button>  
</div>
  </div>
</template>


<script>
import {
  getSysFieldCondition,
   
} from "@/api/generalmessage/index.js";
import creatfrom from "@/components/creatfrom/index";
export default {
  data() {
    return {
  // 收起更多按钮显示
      showform: 0,     
    
    };
  },
  components: {
      creatfrom
  },
    computed: {
    tjfxactiverole() {
      return this.$store.state.menuData.tjfxactiverole;
    },
  },
  watch: {
    tjfxactiverole(newvals, oldval) {

    },
  },
  mounted() {
    let row = this.$store.state.menuData.tjfxactiverole
    this.$nextTick(() => {
       if(row){
           this.getSysField(row);
    }
    });
  },
  methods: {
   // 提交表单
    submitFrom(){
        let val = []
        if(this.$refs.creatfrom){
         val = this.$refs.creatfrom.ajaxSetDataFn()  
        }   
        let par = this.$store.state.menuData.slyspar
        par.data = val
        this.$store.dispatch('setslyspar',par)
        this.$store.dispatch('setformdata',val)
        this.$emit('doubleup')
    },
    resedFormModelFn(){
          // 重置from表单
        if(this.$refs.creatfrom){
          this.$refs.creatfrom.clearform()
        }   
    },
     // 根据点击确定的水利对象获取该水利对象的from表单创建的json数据
    getSysField(row) {
         
      let par = {
        spaceCode: row.spaceCode,
      };
      getSysFieldCondition(par).then((res) => {
        if (res.msg == "执行成功" && res.data.length != 0) {
          this.$refs.creatfrom.creatfromrule(res.data)
        }
      });
    },
  }
};
</script>

<style scoped>
 .buttonWrap{
     display: flex;
     justify-content: center;
     margin-top: 5%;
 }
</style>