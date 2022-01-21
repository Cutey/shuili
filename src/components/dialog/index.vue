<template>
    <div>
        <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <span>需要注意的是内容是默认不居中的</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:{

    },
    name:'dialog',
    data(){
        return{
             centerDialogVisible: false
        }
    },
    computed:{
            // 获取当前选中的水利对象
            activerole(){
                return this.$store.state.menuData.activerole;
            },
        },
    watch:{
            // 监听当前选中的水利对象的变化
            activerole(newval,oldval){
          
            }
        },
    mounted(){

    },
    methods:{

    }
}
</script>