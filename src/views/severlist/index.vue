<template>
    <div class="serverlist-warp">
        <el-container>
            <el-aside width="300px">
                <serverAside />
            </el-aside>
            <el-main v-show="!showdetails">
                <el-form class="serverform" :model='searchfrom' :inline="true" label-width="100px">
                     <el-form-item label="服务名称" >
                        <el-input
                        v-model="searchfrom.serverName"
                        placeholder="请输入服务名称"
                        clearable
                        size="small"
                        style="width: 180px"
                        />
                    </el-form-item>

                    <el-form-item label="发布者姓名">
                        <el-input
                        v-model="searchfrom.publisherName"
                        placeholder="请输入发布者姓名"
                        clearable
                        size="small"
                        style="width: 180px"
                        />
                    </el-form-item>

                    <el-form-item label="服务创建时间">
                       <el-date-picker
                        v-model="searchfrom.createTime"
                        type="datetimerange"
                        range-separator="至"
                         style="width: 280px"
                         format='yyyy-MM-dd HH:mm:ss'
                         value-format='yyyy-MM-dd HH:mm:ss'
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="服务发布时间">
                       <el-date-picker
                        v-model="searchfrom.publishTime"
                        type="datetimerange"
                        style="width: 280px"
                         format='yyyy-MM-dd HH:mm:ss'
                         value-format='yyyy-MM-dd HH:mm:ss'
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>

                     <el-form-item >
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                     </el-form-item>
                </el-form>

                <div class="severlist-row" >
                    <ul class="severlist-rowlist">
                        <li v-for="(item,index) in serverlists" :key="index">
                            <img :src="item.imgUrl" alt="" @click="serverimgclick(item)">
                            <div class="severlist-rowlist-row">
                                 <div class="serveridsa" style="text-align: left;">
                                    <span class="serverspan">服务名称:</span>
                                    <span class="servertext">{{item.serverName}}</span>
                                </div>
                                
                               

                                <div class="serveridsa" style="text-align: right;">
                                    <span class="serverspan">发布人:</span>
                                     <span class="servertext" style="color: #E7540B;">{{item.publisherName}}</span>
                                </div>

                                <div class="ductionspan">
                                    {{item.detailedIntroduction}}
                                </div>
                                
                                 <div class="serveridsa" style="text-align: left;">
                                    <span class="serverspan">服务类型:</span>
                                    <span class="servertext">{{item.serverType+'服务'}}</span>
                                </div>

                                <div class="serveridsa" style="text-align: right;">
                                    <span class="serverspan">发布时间:</span>
                                    <span class="servertext">{{item.publishTime}}</span>
                                </div>
                                 <div class="serveridsa" style="text-align: left;">
                                    <!-- <span class="serverspan">发布时间:</span>
                                    <span class="servertext">{{item.publishTime}}</span> -->
                                </div>
                                 <div class="serveridsa" style="text-align: right;">
                                    <span class="serverspan">创建时间:</span>
                                    <span class="servertext">{{item.createTime}}</span>
                                </div>

                                <footer class="serverlist-btns">
                                    <el-button type="text" @click="creditclick(item)">更多...</el-button>
                                    <!-- <i class="fa fa-credit-card" title="属性信息" ></i> -->
                                </footer>
                            </div>
                        </li>
                    </ul>
                    <Paginationlist  v-show="total>0" :total="total" :page.sync="searchfrom.pageNum" :limit.sync="searchfrom.pageSize" @pagination="getList" />
                </div>

               
                
            </el-main>
            <el-main  v-show="showdetails" style="display: flex;flex-direction: column;padding-bottom: 10px;">
                <header class="detailsheader">
                    <div>
                        <i class="fa fa-credit-card" style="color:#DF770E;font-size:18px;margin-right:5px"></i>
                        <span style="" class="detailstitlespan">{{detailstitle+'服务详情'}}</span>
                    </div>

                    <i class="fa fa-window-close closeicon" @click="detailsclose"></i>
                </header>

                <div class="details-row">
                    <ul class="details-row-uls">
                        <li v-for="item in detailsrowlist" :key="item.key" :class="item.key !='detailedIntroduction' ? 'isspanvae' : ' isdetailedIntroductionspan'">
                            <div style="width: 20%;">
                                <i class="fa fa-file-image-o lisicons"></i>
                                <span class="spanstitle">{{item.title+':'}}</span>
                            </div>

                            <span v-if="detailsrow" class="spansvalue" v-show="item.key !='detailedIntroduction'">
                                {{detailsrow[item.key]}}
                            </span>

                            <span v-if="detailsrow" class="detailedspansvalue" v-show="item.key =='detailedIntroduction'">
                                {{detailsrow[item.key]}}
                            </span>
                        </li>

                        <li class="details-row--btns">
                                <el-button type="primary" plain size="small" @click="detailsclose">返回</el-button>
                                <el-button type="success" plain size="small" @click="serverimgclick(detailsrow)">地图展示</el-button>
                        </li>
                    </ul>
                    

                    <div class="details-row-divs">
                        <img :src="detailsrow.imgUrl" @click="picAmplify"  alt="" v-if="detailsrow">
                    </div>
                  
                </div>
            </el-main>
        </el-container>

          <!--图片放大-->
        <viewer :images="lb"
                @inited="inited"
                class="viewer"
                ref="viewer"
        >
            <template slot-scope="scope">
                <img v-for="src in scope.images" :src="src.imgUrl" :key="src.imgUrl"/>
            </template>
        </viewer>
    </div>
</template>

<script>
import serverAside from './comend/serverAsideAside'
import Paginationlist from '@/components/Paginationlist/index'
import{getServerList} from '@/api/mapserver/index.js'
import newserverlist from '../../../public/data/server.json'
export default {
    name:'serverlist',
    components:{
        serverAside,Paginationlist
    },  
    data(){
        return{
            searchfrom:{
                serverName:'',//服务名称
                createTime:[],//服务创建时间
                publishTime:[],//服务发布时间
                publisherName:'',//发布者姓名
                pageNum: 1,
                pageSize: 6,
                serverType:'' ,//服务类型
            },
            total:30,
            serverlists:[],//服务列表
             //轮播图数据
            lb: [],
            showdetails:false,
            detailsrow : null,
            detailstitle:'',
            detailsrowlist:[
                {
                    title:'服务名称',
                    value:'',
                    key:'serverName',
                },
                {
                    title:'发布人姓名',
                    value:'',
                    key:'publisherName',
                },
                {
                    title:'图层类型',
                    value:'',
                    key:'serverType',
                },
                {
                    title:'服务ID',
                    value:'',
                    key:'serverId',
                },
                {
                    title:'发布日期',
                    value:'',
                    key:'publishTime',
                },
                {
                    title:'创建日期',
                    value:'',
                    key:'createTime',
                },
                {
                    title:'服务地址',
                    value:'',
                    key:'serverUrl',
                },
                {
                    title:'缩略图地址',
                    value:'',
                    key:'imgUrl',
                },
                {
                    title:'左上坐标',
                    value:'',
                    key:'leftOn',
                },
                {
                    title:'左下坐标',
                    value:'',
                    key:'leftBottom',
                },
                {
                    title:'右上坐标',
                    value:'',
                    key:'rightOn',
                },
                {
                    title:'右下坐标',
                    value:'',
                    key:'rightBottom',
                },
                {
                    title:'详细介绍',
                    value:'',
                    key:'detailedIntroduction',
                },
            ]
        }
    },
    computed:{
        menuactive(){
            return this.$store.state.menuData.menuactive
        }
    },
    watch:{
        menuactive(newval,oldval){
            this.detailsclose()
            this.searchfrom.serverType = newval
            this.searchfrom.pageNum = 1
            this.getserverlist()
        }
    },
    mounted(){
        // this.serverlists = newserverlist
        this.$nextTick(()=>{
            this.handleQuery()
        });
    },
    methods:{
        // 搜索按钮
        handleQuery(){
            this.getserverlist()
        },
        // 获取服务列表
        getserverlist(){
            let par = this.creatparmise()
            getServerList(par).then((res)=>{
                if(res.msg == '执行成功'){
                    this.serverlists = res.data.list
                    this.total = res.data.total
                }
            })
        },
        // 重置按钮
        resetQuery(){
            this.searchfrom = {
                serverName:'',//服务发布时间
                createTime:[],//服务创建时间
                publishTime:[],//服务发布时间
                publisherName:'',//发布者姓名
                pageNum: 1,
                pageSize:6,
                serverType:this.menuactive ,//服务类型
            }
            this.getserverlist()
        },
        // 分页器获取当前页面
        getList(val){
            this.searchfrom.pageNum = val.page
            this.getserverlist()
        },
        // 查看属性详情的事件
        creditclick(row){
            this.detailstitle = row.serverName
            this.detailsrow = row
            this.lb.push(row)
            this.showdetails = true
        },
        // 缩略图点击事件
        serverimgclick(row){
              this.$router.push({
          path: `/servermap/${row.serverId}`,
        })
            // this.$router.push({
            //     name: 'servermap',
            //     params: {
            //         id: row.serverId
            //             }
            //     })
            
        },
        // 详情关闭按钮
        detailsclose(){
            this.detailstitle = ''
            this.lb = []
            this.detailsrow = null
            this.showdetails = false
        },
         //图片放大
        picAmplify() {
            this.$viewer.show();
        },
        inited(viewer) {
            this.$viewer = viewer
        },
        // 动态创建获取列表的from参数
        creatparmise(){
            let keys = Object.keys(this.searchfrom)
            let obj = new Object
            for(var i=0;i<keys.length;i++){
                if(this.searchfrom[keys[i]] && this.searchfrom[keys[i]] !='' || this.searchfrom[keys[i]] && this.searchfrom[keys[i]].length !=0){
                    if(keys[i]=='publishTime'){
                        obj.startPublishTime = this.searchfrom[keys[i]][0]
                        obj.endPublishTime = this.searchfrom[keys[i]][1]
                    }else if(keys[i]=='createTime'){
                        obj.startCreateTime = this.searchfrom[keys[i]][0]
                        obj.endCreateTime = this.searchfrom[keys[i]][1]
                    }else{
                         obj[keys[i]] = this.searchfrom[keys[i]]
                    }
                  
                }
            }
            return obj
            
        },
    },
    // 离开当前组建判断，把左侧菜单的默认选项清空，
     beforeRouteLeave (to, from, next) {
        this.$store.dispatch('setmenuactive','')
        next()
    }
}
</script>

<style scoped>
.serverlist-warp{
    height: 100%;
    width: 100%;
    padding-top: 60px;
    background: #ccc;
    display: flex;
}
.serverform{
    display: flex;
    align-items: center;
    height: 60px;
    background: #fff;
    border-radius: 6px;
    width: 100%;
}
.severlist-row{
    width: 100%;
    height: calc(100% - 80px);
    background: #eee;
    border-radius: 6px;
    margin-top: 10px;
}
.severlist-rowlist{
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
    /* background: #DFDADA; */
    /* align-items: center; */
}
.severlist-rowlist li{
    width: calc(50% - 5px);
    height: 32%;
    display: flex;
    align-items: center;
    padding: 10px;
    background: #fff;
    border-radius: 6px;
    justify-content: space-between;
    margin-bottom: 10px;
}
.severlist-rowlist li img{
    height: 100%;
    width: 30%;
    border: 1px solid #EB7421;
    border-radius: 4px;
    padding: 4px;
    cursor: pointer;
}
.severlist-rowlist-row{
    width: calc(70% - 10px);
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    align-content: flex-start;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.serverlist-btns{
    width: 100%;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    border-top: 1px dashed #294766;
}
.serverlist-btns i{
    cursor: pointer;
}
.ductionspan{
    font-size: 14px;
    text-indent:28px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    color: #5C778D;
    height: calc(100% - 160px);
    width: 100%;
}
.serverspan{
    font-size: 14px;
    color:#9EA0A0 ;
    font-weight: 200
}
.serveridsa{
    width: 50%;
    height: 40px;
    text-align: center;
    line-height: 40px;
}
.servertext{
    font-size: 14px;
    color: #458FAC;
    font-weight: bold;
}
</style>

<style scoped>
.detailsheader{
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    height: 50px;
    align-items: center;
    background: #fff;
    border-radius: 5px;
}
.detailstitlespan{
    font-weight: bolder;
    font-size: 18px;
    color: #1E8FD3;
}
.closeicon{
    font-size: 30px;
    transition:.5s;
　　-webkit-transition:.5s;
　　　-moz-transition:.5s;
    cursor: pointer;
}
.closeicon:hover{
    color:#D3331E ;
    -webkit-transform:rotate(180deg) scale(1.2); 
　　-moz-transform:rotate(180deg) scale(1.2);
　　-ms-transform:rotate(180deg) scale(1.2);
　　-o-transform:rotate(180deg) scale(1.2);
}
.details-row{
    margin-top: 10px;
    background: #fff;
    border-radius: 6px;
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    /* flex-direction: column; */
    padding-bottom: 10px;
    padding-right: 10px;
}
.details-row-uls{
    height:100%;
    width: 60%;
    margin-right: 10px;
    position: relative;
    /* background: url('../../assets/image/noc.jpg'); */
}
.details-row-uls li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    border-bottom: 1px dashed #294766;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.details-row-uls .details-row--btns{
    height: 60px;
    width: calc(100% - 10px);
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    border-bottom:0px;
    margin-left: 10px;
    justify-content: center;
}
.isspanvae{
    height:50px;
}
.isdetailedIntroductionspan{
    height:80px;
}
.lisicons{
    color:#E1741C ;
    margin-right: 5px;
}
.spanstitle{
    font-size: 14px;
    color: rgb(3, 19, 33);
    font-weight: bold;
}
.spansvalue{
    width: 79%;
    text-align: left;
}
.detailedspansvalue{
     width: 79%;
    text-align: left;
    /* text-indent: 28px; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    /* color: #5C778D; */
    height: 50px;
}
.details-row-divs{
    flex: 1;
    padding: 5px;
    border: 1px solid #D3A41E;
}
.details-row-divs img{
    height: 100%;
    width: 100%;
}
.viewer{
        display: none;
        }
</style>