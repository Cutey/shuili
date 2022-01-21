<template>
    <div class="server-warp">
        <serverheader />
        <div class="layout-warp" id="layout-warp">
          <router-view />
        </div>
    </div>
</template>

<script>
import serverheader from './comend/serverheader'
export default {
    name:'serverlayers',
    components:{
        serverheader
    },  
    data(){
        return{
            
        }
    }
}
</script>

<style scoped>
.server-warp{
    height: 100%;
    width: 100%;
    position: relative;
}
  .layout-warp{
    width: 100%;
    height: 100%;
    position: relative;
    top: 0;
    left: 0;
    /* background:  url('../assets/image/water1.jpg')  no-repeat; */
    background-size: cover;
    overflow: hidden;
  }
</style>