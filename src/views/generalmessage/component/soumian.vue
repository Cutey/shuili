<template>
    <div class="history-row">
                  <!-- 历史搜索 -->
        <div class="history-comed warp-comden">
          <div class="warp-header">
            <div class="warp-header-right">
              <div class="headerlist"></div>
              <span>最近搜索</span>
            </div>

            <span class="claearspan" @click="clearsearch">清空</span>
          </div>
          <ul class="history-warp factor" style="padding: 0 10px;">
               <li v-for="(item,index) in recentList"  @click="stringSEarch(item.searchName)" :key="index" class="soulis">
                 {{item.searchName}}
               </li>
          </ul>
        </div>
        <!-- 热门搜索 -->
        <div class="history-comed warp-comden">
          <div class="warp-header">
            <div class="warp-header-right">
              <div class="headerlist"></div>
              <span>热门搜索</span>
            </div>
          </div>
           <ul class="history-warp factor" :class="popularList.length>2?'':'isstart'" style="padding: 0 10px;">
              <li v-for="(item,index) in popularList" :key="index" @click="stringSEarch(item.searchName)" class="soulis">
                 {{item.searchName}}
              </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {getpopularList,getrecentList,deleteSearch} from '@/api/generalmessage/index.js'
export default {
    data(){
        return{
            popularList:[],//热门搜素数据
            recentList:[],//最近搜索数据
        }
    },
    mounted(){
        this.getlistdata()
    },
    methods:{
        // 调用获取数据接口的方法
        getlistdata(){
            this.getpopularListfunction()
            this.getrecentListfunction()
        },
         //  获取热门搜素数据
        getpopularListfunction(){
            getpopularList().then((res)=>{
                this.popularList = res.data
            })
        },
         //  获取最近搜素数据
        getrecentListfunction(){
            getrecentList().then((res)=>{
                this.recentList = res.data
            })
        },
        stringSEarch(str){
            this.$emit('listsearchchange',str);
            // this.$nextTick(()=>{
            // })
        },
      //  清空最近搜索
        clearsearch(){
            deleteSearch().then((res)=>{
                    if(res.msg == '执行成功'){
                        this.$message({
                            message: '清空成功',
                            type: 'success'
                        });
                    }
                this.getlistdata()
            })
        }
    }
}
</script>

<style scoped>
.history-row{
    width: 100%;
    height: 30%;
}
</style>


<style scoped>
.soulis{
    width: auto;
    height: 25px;
    color: #fff;
    border-bottom: 1px solid rgb(0 113 241);
    display: flex;
    padding: 0 5px;
    margin-right:15px;
    cursor: pointer;
}
.soulis:hover{
  color: rgb(0 113 241);
}
</style>