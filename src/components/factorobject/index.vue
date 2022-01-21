<template>
  <div class="factor-warp testscrollbar">
      <!-- 统计面板 -->
    <div style>
      <ul v-show="checktype == 'radio'" class="factor" :class="Rolelist.length>2?'':'isstart'">
    
        <li
          :class="isactiverole && isactiverole.spaceCode==item.spaceCode ? 'isactive':'noactive'"
          @click="radioClick(item)"
          v-for="item in Rolelist"
          :key="item.spaceCode"
       
        >{{item.description}}</li>
      </ul>

      <div class="factor massAnalyzer-box" v-show="checktype == 'checkbox'" >
         
        <el-checkbox-group
          v-model="webcheckboxlist"
          class="factor-checkboxgroup"
          @change="checkboxhange"
          :class="Rolelist.length>2?'':'isstart'"
        >
          <el-checkbox-button
            :disabled="isallactive"
            v-for="(item,indexs) in Rolelist"
            :label="item.spaceCode"
            :key="indexs"
            :title="item.total"
          >{{item.description}}</el-checkbox-button>
        </el-checkbox-group>
      </div>

      <ul v-show="checktype == 'tjfx'" class="factor" :class="Rolelist.length>2?'':'isstart'">
        <!-- +'&nbsp;'+'('+item.total+')' 数量展示 -->
        <li
          :class="tjfxactiverolenew && tjfxactiverolenew.spaceCode==item.spaceCode ? 'isactive':'noactive'"
        
          @click="tjfxradioClick(item)"
          v-for="item in Rolelist"
          :key="item.tableName"
        >{{item.description}}</li>
      </ul>
    </div>
  </div>
</template> 

<script>
import { listByRole } from "@/api/generalmessage/index.js";
export default {
  props: {
    checktype: {
      type: String,
      default: "radio" //radio 为单选，checkbox 为多选
    }
  },
  name: "Rolelist",
  data() {
    return {
      Rolelist: [],
      isallactive: false,
      webcheckboxlist: [],
      tjfxactiverolenew: null, //统计分析的选中对象
      isactiverole: null
    };
  },
  computed: {
    // 单选框选中的绑定值
    activerole() {
      return this.$store.state.menuData.activerole;
    },
    tjfxactiverole() {
      return this.$store.state.menuData.tjfxactiverole;
    }
  },
  watch: {
    // 监听单选选中值的变化
    activerole(newvalue, oldvalue) {},
    tjfxactiverole(newval, oldval) {
      this.tjfxactiverolenew = newval;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getlistByRole();
    });
  },
  methods: {
    // 根据模块类型判断
    watchtype() {
      if (this.checktype == "tjfx") {
        this.tjfxradioClick(this.Rolelist[0]);
      }
    },
    // 获取水利对象的接口
    getlistByRole() {
      listByRole().then(res => {
        if (res.code == 200) {
          this.Rolelist = res.data;
          this.$store.dispatch("setlistByRole", res.data);
          this.watchtype();
        }
      });
    },
    // 水利对象单选的点击事件
    radioClick(row) {
      this.isactiverole = row;
     
       let par = this.$store.state.menuData.slyspar
        par.tableNames = ''
        par.tableNames = row.spaceCode+','
        this.$store.dispatch('setslyspar',par)
        this.$store.state.menuData.tjfxactiverole = row
          // this.$emit('tjfxradiochange',row);
      this.$store.dispatch("setactiverole", row);
      this.$emit("radioClick", row);
    },
    // 复选框选中事件
    checkboxhange(arr) {
      let par = this.$store.state.menuData.slyspar
       
       par.tableNames = ''
      // 判断如果用户没有点击水利对象，默认是选中全部
      if (arr.length == 0) {
        
      } else {
        //否则就是将选中的水利对象添加到vuex中进行存储
        let newarr = [];
        for (var j = 0; j < arr.length; j++) {
              par.tableNames += arr[j]+','
          }
        this.$store.dispatch('setslyspar',par)
        this.$store.dispatch("setcheckboxlist", newarr);
      }
    },
    // 复选框的全选事件; isall 父组件传过来依此判断是全部选中还是全部取消选中
    checkboxalllist(isall) {
      if (isall) {
        for (var i = 0; i < this.Rolelist.length; i++) {
          // 如果选中值中没有包含第 i 项，那么就添加
          if (this.webcheckboxlist.indexOf(this.Rolelist[i].spaceCode) == -1) {
            this.webcheckboxlist.push(this.Rolelist[i].spaceCode);
          }
        }
      } else {
        this.webcheckboxlist = [];
      }
      this.checkboxhange(this.webcheckboxlist);
    },
    // 统计分析水利对象选中事件
    tjfxradioClick(row) {
      this.$store.dispatch("setjfxactiverole", row);
      this.tjfxactiverolenew = row;     
      this.$emit('tjfxradiochange',row);
    },
    // 绑定值重置
    resetactive() {
   
      this.isactiverole = null
      this.tjfxactiverolenew = null
      this.webcheckboxlist = [];
      
    }
  }
};
</script>

<style scoped>
.factor-warp {
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 15px 5px 5px 5px;
}
.factor {
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  /* justify-content: space-around; */
}
.factor li {
  color: #fff;
  font-size: 16px;
  width: 110px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  list-style: none;
  cursor: pointer;
  text-shadow: rgb(0 166 124) 0px 0px 1.04167vw;
  border-radius: 6px;
  box-shadow: rgb(0 113 241) 0px 0px 0.26042vw;
  padding: 5px 5px;
  margin: 0 6px 10px 6px;
  background: rgba(0, 0, 0, 0.5);
}
.factor .isactive{
   box-shadow: #f17408 0px 0px 0.26042vw;
  color: #f17408;
}
.factor .isactive:hover {
  box-shadow: #f17408 0px 0px 0.26042vw;
  color: #f17408;
}
.factor .noactive {
  /* background: rgba(12,152,237,.65);
    border-color: rgba(12,152,237,.65); */
}
.factor-checkboxgroup {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
}
.massAnalyzer-box >>> .el-checkbox-button__inner {
  display: inline-block;
  border: 0;
  line-height: inherit;
  width: 110px;
  overflow: hidden;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  list-style: none;
  cursor: pointer;
  height: 30px;
  text-shadow: rgb(0 166 124) 0px 0px 1.04167vw;
  border-radius: 6px;
  box-shadow: rgb(0 113 241) 0px 0px 0.26042vw;
  padding: 7px 5px;
  margin: 0 5px 10px 5px;
  background: rgba(0, 0, 0, 0.5);
}
.massAnalyzer-box
  >>> .el-checkbox-button.is-checked
  .el-checkbox-button__inner {
  box-shadow: #f17408 0px 0px 0.26042vw;
  color: #f17408;
}
.massAnalyzer-box
  >>> .el-checkbox-button:first-child
  .el-checkbox-button__inner {
  text-shadow: rgb(0 166 124) 0px 0px 1.04167vw;
  border-radius: 6px;
  box-shadow: rgb(0 113 241) 0px 0px 0.26042vw !important;
}
.isstart {
  justify-content: flex-start;
}
.isstart li {
  margin-right: 20px;
}
</style>
