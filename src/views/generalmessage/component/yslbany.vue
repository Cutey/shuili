<template>
    <div class='sondiv'>
        <soumian  @listsearchchange='listsearchchange' />
        <!-- 水利对象 -->
        <div class="shuili-comed">
          <div class="warp-header">
            <div class="warp-header-right">
              <div class="headerlist"></div>
              <span>要素类型</span>
            </div>

            <el-checkbox v-model="checked" @change="checkChange">全选/全不选</el-checkbox>
 
          </div>
          <ul class="history-warp" style="height:80%">
              <Rolelist ref="Rolelist" :checktype='checktype'  />
          </ul>

          <ul class="history-warp-footer warp-fotter">
              <el-button @click="checkchongzhi">重置</el-button>
              <!-- <el-button type="primary" @click="checjktrue">确定</el-button> -->
          </ul>
        </div>
    </div>
</template>

<script>
import Rolelist from '@/components/factorobject/index'
import soumian from './soumian'
export default {
    name:'yslbany',
    components:{
      Rolelist,soumian
    },
    data(){
        return{
            checked:false,
            checktype:'checkbox',
        }
    },
    mounted(){

    },
    methods:{
        /// 全选和全不选的选择框change事件
        checkChange(val) {
          this.$refs.Rolelist.checkboxalllist(val)
        },
        //确定事件
        checjktrue(){
          this.checkchongzhi()
          this.$emit('showmoudlechange',false);
        },
        checkchongzhi(){
          this.$refs.Rolelist.webcheckboxlist = []
          this.checked = false
        },
        // 要素列表重置
        resetactivechange(){
          this.checked = false
          if(this.$refs.Rolelist){
            this.$refs.Rolelist.resetactive()
          }
        },
         //  热门搜索和最近搜素内容点击事件
        listsearchchange(str){
          this.$emit('searchchange', str);
        }
       
    }
}
</script>

<style scoped>

</style>