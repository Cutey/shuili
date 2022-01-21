<template>
    <div class="Pagination-warp">
         <el-pagination
            background
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            @current-change="handleCurrentChange"
            :pager-count='pagercount'
            :total="total"
            layout="prev, pager, next"
            >
        </el-pagination>
    </div>
</template>

<script>
export default {
    name:'Pagination',
    props:{
        total: {
            required: true,
            type: Number
            },
        // currentPage:{
        //     required: true,
        //     type: Number
        // }
    },
    data(){
        return{
            pageSize:10,
            pagercount:5,
            currentPage:1,
        }
    },
    methods:{
        handleCurrentChange(val) {
           this.$emit('pageNochange', val);
        }
    }
}
</script>

<style scoped>
.Pagination-warp{
    width: 100%;
    height: 100%;
}
</style>