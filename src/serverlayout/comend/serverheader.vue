<template>
    <div class="server-header">
         <div class="layout-header-logo layout-header-div">
            <img src="../../assets/image/watrelog.jpg" alt="">
            <span>公共安全服务定制开发子系统</span>
        </div>

        <ul class="routlist-warp">
            <li class="routerlis" @click="routerclick('/generalmessage')">
                 <i class="iconfont icon-GIS-tulitucengicon_jiezhifa"></i>
                 <span>一张图展示</span>
            </li>

            <li class="routerlis" @click="routerclick('/severlist')"  v-show="$route.name!='severlist'">
                 <i class="iconfont icon-layers"></i>
                 <span>服务列表</span>
            </li>

            <i v-show="$route.name=='servermap'" :title="item.title" @click="moudlechange(item)" v-for="(item,index) in btnstype" :key="item.key+index" class="btnicon" :class= "[ moudelvalue == item.key ?'activemakeColor':'',item.icon]" ></i>
        </ul>
         <!-- 用户信息 -->
        <div class="layout-header-users layout-header-div">
            <span>{{username}}</span>
            <Usercomd />
        </div>
    </div>
</template>

<script>
import Usercomd from '@/components/user/index'
import Timecomd from '@/components/time/index'
export default {
    components:{
        Usercomd,Timecomd
    },
    data(){
        return{
            routerlist:[
                {
                    icon:'iconfont icon-GIS-tulitucengicon_jiezhifa',
                    title:'一张图展示',
                    path:'/generalmessage'
                },
                {
                    icon:'iconfont icon-layers',
                    title:'服务列表',
                    path:'/severlist'
                }
            ],
             btnstype: [
                {
                title: "详情展示",
                icon: "fa fa-credit-card",
                key: "xqzs"
                },
                {
                title: "图例展示",
                icon: "fa fa-sitemap",
                key: "tlzs"
                },
                {
                title: "图层设置",
                icon: "fa fa-cog",
                key: "tcsz"
                }
            ],
            username:'',
            moudelvalue:'',
            newshowmoudle:true
        }
    },
     computed:{
        showmoudle(){
            this.newshowmoudle = this.$store.state.menuData.showmoudle
            return this.$store.state.menuData.showmoudle;
        },
        showserverkey(){
            return this.$store.state.menuData.showserverkey;
        }
    },
    watch:{
        showmoudle(newvla,oldval){
            if(!newvla){
                this.moudelvalue = ''
            }
            this.newshowmoudle = newvla
        },
    },
    mounted(){
        this.username = this.$store.state.user.name
    },
    methods:{
        routerclick(path){
            this.moudelvalue = ''
            this.$store.dispatch('setshowmoudle',false)
            this.$router.push(path)
            
        },
         // 展示模块切换
        moudlechange(row){
            this.moudelvalue = row.key
            this.$store.dispatch('setshowserverkey',row.key)
            if(this.newshowmoudle){

            }else{
                this.$store.dispatch('setshowmoudle',true)
            }
            // this.showmoudle =  !this.showmoudle
        }
    }
}
</script>

<style scoped>
.server-header{
    /* opacity: 0.8; */
    transition: opacity 400ms;
    background: #00264c;;
    color: #fff;
    height: 54px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
}
.layout-header-div{
        display: flex;
        align-items: center;
        list-style: none;
         height: 100%;
}
.layout-header-logo{
        width: 30%;
        justify-content: flex-start;
}
.layout-header-logo img{
        width: 50px;
        height: 50px;
        border-radius: 5px;
        border: 1px solid ;
}
.layout-header-logo span{
        font-size: 28px;
        color: #fff;
        font-weight: bold;
        margin-left: 6px;
}
.layout-header-users {
        width: 5%;
        justify-content: flex-end;
}
.routlist-warp{
    width: 65%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 15px;
}
.routerlis{
    color: #ccc;
    font-size: 16px;
    /* font-weight: bold; */
    cursor: pointer;
    margin-right: 10px;
}
.routerlis:hover{
    color: #DF5B0E;
}
</style>

<style scoped>
.routlist-warp .activemakeColor{
    color: #E5821E;
    /* background: rgba(159,157,155,.8); */
    border-radius: 6px;
   
}

.btnicon{
    font-size:20px;
    /* margin-right: 10px; */
    /* color: #fff; */
    cursor: pointer;
    padding: 1px 4px;
    margin-right: 10px;
    color: #ccc;
}
.btnicon:last-child{
   margin-right: 0px; 
}
</style>