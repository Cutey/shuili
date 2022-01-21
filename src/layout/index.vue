<template>
  <div class="app-wrapper">
      <Layoutheader style="" class=""/>
      <div class="layout-warp" id="layout-warp">
          <router-view />
      </div>
  </div>
</template>

<script>
import Layoutheader from "./components/header"
export default {
  name: 'Layout',
  components: {
    Layoutheader
  },
 
  computed: {

  },
  methods: {
    
  },
}
</script>

<style  scoped>
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .layout-warp{
    width: 100%;
    height: 100%;
    position: relative;
    top: 0;
    left: 0;
    background:  url('../assets/image/water1.jpg')  no-repeat;
    background-size: cover;
    overflow: hidden;
  }
 
</style>
