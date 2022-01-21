<template>
  <div style="position: absolute; width: 95%; height: 100%;padding:0 2% 0 2%">
    <div id="tableWrap" style="width: 100%; height: 100%">
      <div class="tongjiNav">
        <!-- 统计维度 -->
        <div class="selectWrap "  >
          <el-select
            @change="weiduData"
            v-model="radioValue"
            filterable
            class="weiduStyle"
            placeholder="请选择"
            :popper-append-to-body="true"
            v-show="btnactive"
          >
            <el-option
              v-for="item in moudlelist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <!-- 切换图表 -->
        <div class="tableChange" style="color: #fff">
          <span
            @click="typebtnclick(item)"
            v-for="item in btnlist"
            :key="item.value"
            :title="item.title"
            :class="btnactive == item.active ? 'activebtn' : 'noactivebtn'"
            ><i :class="item.icon"></i
          ></span>
       
        </div>
      </div>
      <!-- 面包屑 -->
      <div
        class="tongjitabs warp-comden"
        v-show="btnactive"
        style="
          height: 40px;
          display: flex;
         
          margin-top: 5%;
          border: 0;
        "
      >
        <div
          v-for="(item, index) in tongjiList"
          :key="item.code"
          style="color: #fff"
        >
          <span @click="activecityclick(item, index)" style="cursor: pointer">{{
            item.regoinName
          }}</span>
          <i
            class="el-icon-arrow-right"
            style="color: #d3cecc"
            v-show="Number(index + 1) != tongjiList.length"
          ></i>
        </div>
      </div>
      <!-- 列表展示 -->
      <div id="echarTabel" class="testscrollbar" v-show="btnactive">
        <el-table
          :data="tableData"
          align="center"
          @row-click="tableclick"
          :cell-style="tableStyle"
          :header-cell-style="tableStyle"
          :highlight-current-row="true"
          
        >
          <el-table-column
            prop="regoinName"
            label="行政区"
            value="regoinCode"
            align="center"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="number"
            align="center"
            value="regoinCode"
            :label="tongjiText"
            width="180"
          >
            <template slot-scope="{}" slot="header">
              <!-- 统计指标 -->
             
                <div class="selectWrap selectStyle" style="width: 100%">
                <el-select
                  @change="slectData"
                  v-model="selectvalue"
                  filterable
                  placeholder="请选择"
                  :popper-append-to-body="true"
                >
                  <el-option
                    v-for="item in selectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              
            </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- <button @click="propData()">dsd</button> -->
      </div>
      <!-- 图表展示 -->
      <div class="testscrollbar" style="height: 80%; overflow-y: auto">
        <div id="echarWrap" v-show="!btnactive" style="width: 380px; heigt: 80%">
          <!-- overflow-y: auto; -->
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import * as echarts from "echarts";
import { postStatistic, getIndicator } from "@/api/generalmessage/index.js";
import mapUtil from "@/utils/Openlayer-utils";
import Overlay from 'ol/Overlay';
    import mapView from "@/components/map/mapInstance";
    import { Projection, fromLonLat, transform, get } from "ol/proj";
export default {
  props: {
    dataechar: {
      type: Object,
      default: "",
    },
    moudlelist: {
      type: Array,
      default: "",
    },
    tjwdradio: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectvalue: "",
      // switchValue: "图表",
      switchMadle: null,
      myChart: null,
      
      mapInstance: null,
      tableActive: true,
      btnactive: true,
      // 图表显隐
      ismore: true,
      btnlist: [
        {
          icon:'fa fa-list',
          title: "统计列表",
          value: "list",
          active:true
        },
      {
          icon: "fa fa-bar-chart",
          title: "统计图表",
          value: "echart",
          active:false
        }
      
      ],
      radioValue: "",
      // 收起显隐
      // showform: false,
      // showforms: false,
      // 图表显示
      tongjiText: null,
      loading: null,
      tableColumn: "河流条数",
      // 下拉框数组
      selectList: [],
      // 表格数组
      tableData: [],
      // 请求统计数据
      postData: {},
     
           pointList: [],
      // 面包屑数组
      tongjiList: [
        {
          regoinName: "全国",
          regoinCode: "",
        },
      ],

      // 地址数组
      addressList: [],
      // 数量数组
      numberList: [],
      // 文本样式
      textColor:"black",
     
    };
  },
  components: {
    mapView
  },

  mounted() {
    // 单选 当前选中值
     
    this.radioValue = this.tjwdradio;
    let indicatorstr = "";
    for (var i = 0; i < this.dataechar.StatIndicator.length; i++) {
      indicatorstr += this.dataechar.StatIndicator[i] + ",";
    }
//  请求下拉框的参数
    let selectVal = {
      spaceName: this.dataechar.spaceCode,
      indicatorList: indicatorstr,
    };
    this.postData = this.dataechar;
    this.postData.StatIndicator = this.dataechar.StatIndicator[0];
    this.$nextTick(() => {
      this.getSelectval(selectVal);
    });
  },
  methods: {
    // 初始化echars
    initEchars() {
      //   / 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById("echarWrap"));
     var myColor = ['#eb2100', '#eb3600', '#d0570e', '#d0a00e', '#34da62', '#00e9db', '#00c0e9', '#0096f3', '#33CCFF', '#33FFCC'];
    // 绘制图表
      this.myChart.setOption({
        title: {
          // text: '统计结果'
        },
        grid: {
          left: 86,
          top: 10, // 设置条形图的边距
          right: 54,
          bottom: 30,
        },
        tooltip: {},
        yAxis: {
          data:  this.addressList,
          splitLine: {
            show: false,
            lineStyle: {
              color: "#e1e1e1",
             
            },
          },
          axisLabel: {
            interval: 0,
            rotate: -10, //倾斜度 -90 至 90 默认为0
             margin: 5,
            textStyle: {
              fontWeight: "none",
              fontSize:16,
              color: "#fff",
              
            },
          },
        },
        xAxis: {
          axisLabel: {
            margin: 5,
            textStyle: {
              fontWeight: "none",
              color: "#fff",
            },
          
          },
           splitLine: {
            show: false,
            lineStyle: {
              color: "#e1e1e1",
             
            },
          },
        },
        series: [
          {
            name: this.tongjiText,
            type: "bar",
            data:   this.numberList,
            barWidth: 15, //柱子的宽度
            silent: false,
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    // "formatter": "{c}%"
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: '#34DCFF',
                },
            },
            color: '#2DB1EF',
            itemStyle: {
             color: function(params) {
                        var num = myColor.length;
                        return myColor[params.dataIndex % num]
                    },
            
              barBorderRadius:  '', // （顺时针左上，右上，右下，左下
            },
          },
        ],
      })
   let num = this.addressList.length * 20 + 50;
      this.myChart.resize({ height: num });
    
    }, 
  
    // 面包屑节点点击事件
    activecityclick(val, index) {
      this.tongjiList = this.tongjiList.splice(0, index);
      this.tongjiList.push(val);
      // 添加regionCode值
      this.dataechar.regionCode = val.regoinCode;
      if (this.myChart) {
        this.myChart.dispose();
      }
      this.postStatisticList(this.dataechar);
    },
    // 切换图表列表方法
    typebtnclick(val) {
      if (val.value == "echart") {
         this.btnactive = false;
           this.initEchars();
      } else {
        this.btnactive = true;
      }
    },
      // 创建图层
        ceratmapfeater(data,id){
            let geodata = data
            let styleObj = {
                circle: "",
                fill: "rgba(13,158,196,0.3)",
                stroke: "rgba(29,182,221)",
                line: 4
                };
                let featureold = mapUtil.createGeoJsonFeature(geodata)
                featureold[0].id = id
                featureold[0].setStyle(mapUtil.setStyle(styleObj))
                mapUtil.createLayer(featureold,'listmaprow',2,null,'Geojson'); //添加图层
            
        },
    // 请求统计接口
    postStatisticList(data) {
      // 销毁实例
      mapUtil.clearLayer('tjpoints')
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        target: "#tableWrap",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      postStatistic(data).then((res) => {
        if (res) {
          this.loading.close();
          this.pointlist =[];
          this.addressList = [];
          this.numberList = [];
          this.tableData = [];
          let echarsList = res.data;
          if (echarsList && echarsList.length > 0) {
            echarsList.forEach((item, index) => {
              this.addressList.push(item.regoinName);
              this.numberList.push(item.number);
              this.tableData.push(item);
              // 中心点
              let objcenter = [item.centerx , item.centery]
              // push 实例数组
              this.ceratmappoint(objcenter,item.regoinCode,index)
            });
            mapUtil.createLayer(this.pointlist,'tjpoints',3,null,'Geojson'); //添加图层
          }
        
        }
      });
    },
    deleteFeater(){
        // 销毁实例
      mapUtil.clearLayer('tjpoints')
      
    },
       // 添加中心点位展示
        ceratmappoint(pointgeo,nameid,index,listlength){
         
       
            let  pointmap = mapUtil.createFeature('point',nameid,pointgeo)

            let pointstyleObj = {
                icon: "",
                scale: 0.6,
                rotateWithView:true,
                text:this.tableData[index].number.toString(),
                    // 字体颜色 默认黑色
                textColor:this.textColor,
                   // 字体背景颜色 RGBA
                 backgroundFill: "red", 
                padding: [5, 5, 0, 5],
                font:'normal 20px 微软雅黑',
                // 点的圆半径
                radius:"0"
            
                };
                pointmap.setStyle(mapUtil.setStyle(pointstyleObj))
                pointmap.name = nameid
                pointmap.index = index
                
                this.pointlist.push(pointmap)
        },
    // 请求下拉框接口
    getSelectval(data) {
      getIndicator(data).then((res) => {
        if (res.msg == "执行成功") {
          this.selectList = res.selectIndicator;
          if (this.selectList.length > 0) {
            this.slectData(this.selectList[0].value);
          }
        }
      });
    },
    // 统计指标下拉框切换
    slectData(val) {
      this.selectvalue = val;
      this.dataechar.StatIndicator = val;
      (this.dataechar.StatDimen = this.radioValue),
        this.postStatisticList(this.dataechar);
      let that = this;
      this.selectList.forEach(function (item) {
        if (item.value == val) {
          // 统计图 标注文本
          that.tongjiText = item.label;
        }
      });
    },
    // 统计维度下拉框切换
    weiduData(val) {
      this.dataechar.StatIndicator = this.selectvalue;
      (this.dataechar.StatDimen = val), this.postStatisticList(this.dataechar);
    },
    // 表格样式
    tableStyle() {
      return "color:#fff;";
    },
    // 点击表格方法
    tableclick(val) {
      this.tongjiList.push(val);
      // 添加regionCode值
      this.dataechar.regionCode = val.regoinCode;
      if (this.myChart) {
        this.myChart.dispose();
      }
      this.postStatisticList(this.dataechar);
    },
  },
};
</script>

<style scoped >
#echarTabel {
  width: 370px;
  height: 70%;
  margin: 0px auto;
  /* margin-left: -10px; */
  overflow-y: auto;
  /* background: red; */
  cursor: pointer;
}

.selectWrap {
  width: 50%;
}
.selectWrap >>> .el-select {
  height: 100%;
}
.selectWrap >>> .el-input {
  height: 100%;
}
.selectWrap >>> .el-input--medium .el-input__inner {
  height: 100%;
}
.selectWrap >>> .el-input__inner {
  border: none;
  /* border-right: 1px solid #EA530F; */
  background: rgba(0, 0, 0, 0);
  color: #fff;
  font-size: 16px;
  border-radius: 0;
  height: 100%;
}
.selectStyle >>> .el-select__caret::before {
  display: block;
  margin-top:-34%;
}
.matbspan {
  position: relative;
  cursor: pointer;
  z-index: 999;
}
.matbspan-more {
  top: 315px;
  left: 180px;
}
.matbspan-less {
  top: 20px;
  left: 287px;
}
.matbspan .fa {
  color: blue;
  margin-right: 10px;
}
.tongjiNav {
  display: flex;
  justify-content: space-between;
  margin-top: 5%;
  
}
.tableChange {
  cursor: pointer;
  display: flex;
  /* width: 15%; */
  justify-content: space-between;
  margin-right: 10px;
}
.noactivebtn {
  height: 40px;
  width: 40px;
  font-size: 26px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  margin-right: 5px;
  padding: 5px;
  cursor: pointer;
      display: flex;
    /* display: block; */
    align-items: center;
    justify-content: center;
}
.activebtn {
  color: #ef8613;
  height: 40px;
  width: 40px;
  font-size: 26px;
  background: rgba(26, 154, 220, 0.6);
  border-radius: 5px;
  margin-right: 5px;
  padding: 5px;
  cursor: pointer;
      display: flex;
    /* display: block; */
    align-items: center;
    justify-content: center;
}
.weiduStyle{
width: 80%;
/* border:1px solid rgba(255, 255, 255, 0.5); */
background: rgba(6,30,62,.8);
border-radius: 5%;
}
 
</style>

<style scoped>
/deep/ .el-table{
  background: rgba(0, 0, 0, 0);
}
/deep/.el-table th.is-leaf, .el-table td{
  border-bottom: 1px solid rgba(12,156,212,.7);
  background: rgba(11,98,159,.7) !important;
  font-size: 16px;
}
/deep/.el-table td {
    border-bottom: 1px solid rgba(172,191,205,.7);
}
/deep/.el-table tr{
  background: rgba(0, 0, 0, 0);
}
/deep/.el-table--enable-row-hover .el-table__body tr:hover>td { 
    background-color:rgba(11,98,159,.7); 
}	
</style>