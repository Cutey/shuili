<template>
 <ul class="details-row-uls">
        <li v-for="item in detailsrowlist" :key="item.key" :class="item.key !='detailedIntroduction' ? 'isspanvae' : ' isdetailedIntroductionspan'">
            <div style="width:50%;">
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
</ul>
</template>

<script>
export default {
    props:{
        detailsrow: {
        type: Object,
        default: null //radio 为单选，checkbox 为多选
        }
    },
    data(){
        return{
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
            ],
        }
    }
}
</script>

<style scoped>
.details-row-uls{
    height:100%;
    width: 100%;
    /* margin-right: 10px; */
    position: relative;
    padding: 0 10px;
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
    width: 65%;
    text-align: right;
    overflow: hidden;
      white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>