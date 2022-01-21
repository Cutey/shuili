<template>
    <ul class="xingqing-warp testscrollbar">
        <li v-for="(item,index) in particularslist" :key="index" class="particulars-lis">
            <span class="lablespan" :title="item.alias">{{item.alias+':'}}</span>
            <span class="valuespan">{{item.value}}</span>
        </li>
    </ul>
</template>

<script>
export default {
    name:'particulars',
    data(){
        return{
            particularslist:[]
        }
    }
}
</script>

<style scoped>
.xingqing-warp{
    height: 100%;
    width:100%;
    overflow-y:auto ;
    padding: 0 5px;
    margin: 0;
}
.particulars-lis{
    height: 40px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}
.lablespan{
    color: #fff;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width:40%;
}
.valuespan{
    width: 60%;
    color:#fff;
    font-size: 14px;
    text-align: center;
}

</style>