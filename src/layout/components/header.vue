<template>
    <div class="layout-header">
        <!-- 水利logo -->
        <div class="layout-header-logo layout-header-div">
            <img src="../../assets/image/watrelog.jpg" alt="">
            <span>公共安全服务定制开发子系统</span>
        </div>
        <!-- 模块切换 -->
        <ul class="layout-header-tab layout-header-div">
            <li v-for="(item,index) in tablist" :key="index" :style="ullisStyle" @click="tabClick(item)" :class="routepath==item.path?'isactienmenu':'noactienmenu'">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
                <div v-show="routepath == item.path" class="isactivebg"></div>
            </li>
        </ul>
        <!-- 时间组建 -->
        <div class="layout-header-timer layout-header-div">
            <Timecomd />
        </div>
        <!-- 用户信息 -->
        <div class="layout-header-users layout-header-div">
            <Usercomd />
            <i class="fa fa-sign-out lauoutbtn" title="返回首页"></i>
        </div>
    </div>
</template>

<script>
import Timecomd from '@/components/time/index'
import Usercomd from '@/components/user/index'
export default {
    name:"layoutheader",
    components:{
        Timecomd,Usercomd
    },
    data(){
        return{
            tablist:[
                // {
                //     path:"numberlook",
                //     title:"数字看板",
                //     key:"numberlook",
                //     icon:"fa fa-laptop"
                // },
                // {
                //     path:"generalmessage",
                //     title:"综合信息",
                //     key:"generalmessage",
                //     icon:"fa fa-commenting-o",
                //     isnei:true,
                // },
                //  {
                //     path:"sanwei",
                //     title:"三维展示",
                //     key:"generalmessage",
                //     icon:"fa fa-commenting-o",
                //     isnei:false
                // },
                // {
                //     path:"themeresults",
                //     title:"主题成果",
                //     key:"themeresults",
                //     icon:"fa fa-themeisle"
                // },
                // {
                //     path:"projectapplication",
                //     title:"专题应用",
                //     key:"projectapplication",
                //     icon:"fa fa-safari"
                // },
                // {
                //     path:"industryshared",
                //     title:"行业共享",
                //     key:"industryshared",
                //     icon:"fa fa-share-alt"
                // },
            ],
            routepath:null
        }
    },
    computed: {
         //  设置循环的ul 样式
        ullisStyle() {
            let widthnum = 100 / this.tablist.length
            if(widthnum > 30){
                widthnum = 20
            }
            var obj = {
                width: widthnum + "%",
            };
            return obj;
        },
    },
    mounted(){
        // this.tabClick(this.tablist[0])
    },
    methods:{
        tabClick(row){
           
            if(row.isnei){
                 this.routepath = row.path;
                 this.$router.push(row.path)
            }
           
        }
    }
}
</script>

<style scoped>
    .layout-header{
        height: 70px;
        width : 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 5px;
        background: linear-gradient(to right,rgba(10,15,29,.6) 40%,rgba(1,12,45,.4) 70%,rgba(1,12,45,.4) 80%,rgba(37,55,150,.3) 100%);
        box-shadow: 0px 20px 20px -20px #0B629F;
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
    .layout-header-tab{
        width: 55%;
        justify-content: center;
    }
    .layout-header-tab li{
        background: url('../../assets/image/header-bt.png') no-repeat;
        height: 65%;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
    }
    .layout-header-tab li i{
        font-size: 24px;
        margin-right: 5px;
    }
    .layout-header-tab li span{
        font-size: 18px;
        font-weight: bold;
    }
    .isactivebg{
        background: url('../../assets/image/activemap.png');
        background-repeat: no-repeat;
        background-position-y: center;
        height: 30px;
        width: 100%;
        position: absolute;
        bottom: -17px;
        left: -13px;
        background-size: 100% 100%;
    }
    .noactienmenu{
        color: #0EB9EA;
    }
    .isactienmenu i{
        color: #0EB9EA;
    }
    .isactienmenu span{
        color: #fff;
    }
    .noactienmenu i{
        font-size: 24px;
        color: #7C8E9B;
        margin-right: 5px;
    }
    .layout-header-timer{
        width: 20%;
    }
    .layout-header-users {
        width: 5%;
        justify-content: flex-end;
    }
    .lauoutbtn{
        font-size: 42px;
        color: #0B629F;
        cursor: pointer;
    }
    .lauoutbtn:hover{
        color: #D74B0C;
    }
</style>