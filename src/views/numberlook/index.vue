<template>
    <div class="numberlook-warp">
        <span>数字看板模块</span>
    </div>
</template>

<script>
import mapInstance from '@/components/map/mapInstance'
export default {
    components:{
        mapInstance
    },
    name:'numberlook',
    data(){
        return{

        }
    },
    mounted(){
        this.$nextTick(()=>{
            
        });
    },
    methods:{

    }
}
</script>

<style scoped>
.numberlook-warp{

}
</style>