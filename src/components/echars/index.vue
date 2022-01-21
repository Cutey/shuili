<template>
  <div>
      <div id="echarWrap" style="width:100%;height:340px">
 
  </div>
  <div id="echarTabel">
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="address"
        label="行政区"
        width="180">
      </el-table-column>
      <el-table-column
        prop="num"
        label="河流数量(条)"
        width="180">
      </el-table-column>
      
    </el-table>
  </div>
  </div>
</template>


<script>
import * as echarts from 'echarts';
export default {
  data() {
    return {
   tableData: [{
            address: '河北',
            num: '150',
           
          }, {
            address: '北京',
            num: '156',
          
          }, {
            address: '山西',
            num: '233',
            
          }, {
            address: '太原',
            num: '2323',
           
          }]
    };
  },
  components: {
      
  },
  mounted() {
    this.$nextTick(() => {
this.initEchars();
    });
  },
  methods: {
      initEchars(){
       
        //   / 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('echarWrap'));
// 绘制图表
  myChart.setOption({
  title: {
    // text: '统计结果'
  },
  tooltip: {},
  xAxis: {
    data: ['北京', '河北', '河南', '山东', '浙江', '杭州']
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
});
      }
  }
};
</script>

<style scoped>
 
 #echarTabel{
     width: 100%;
     height: 220px;
     /* background: red; */
 }
</style>