<template>
    <div class="Aside-warp">
       <el-menu
       :default-active="meneactive"
        background-color="rgba(0,0,0,0)"
        text-color="#fff"
        @select='memuselect'
        :mode="mode"
      >
    <SubMenu :subMenuList="menuList"  :mode="mode"/>
  </el-menu>
    </div>
</template>

<script>
import SubMenu from './subMenu'
export default {
   props: {
    mode: {
      //菜单 水平  垂直 horizontal / vertical
      type: String,
      default: "vertical",
    },
    menuTrigger: {
      //菜单 水平  垂直 horizontal / vertical
      type: String,
      default: "vertical",
    },
  },
    name:'serverAside',
    components:{
      SubMenu
    },
    data(){
        return{
            servertypelist:[
                {
                    label:'WVT服务',
                    value:'WVT'
                },
                {
                    label:'WMS服务',
                    value:'WMS'
                },
                {
                    label:'WMTS服务',
                    value:'WMTS'
                },
                {
                    label:'WFS服务',
                    value:'WFS'
                },
            ],
            menuList: [
              {
                name:'服务类型',
                icon:'',
                value:'',
                key:'fwlx',
                children:[
                  {
                    name:'WVT服务',
                    key:'WVT',
                    icon:'',
                    value:'',
                  },
                  {
                      name:'WMS服务',
                      key:'WMS',
                      icon:'',
                      value:'',
                  },
                  {
                      name:'WMTS服务',
                      key:'WMTS',
                      icon:'',
                      value:'',
                  },
                  {
                      name:'WFS服务',
                      key:'WFS',
                      icon:'',
                      value:'',
                  },
                ]
              }
          ],
          meneactive:'',//默认选中的节点
        }
    },
    mounted(){
      this.meneactive = this.menuList[0].children[0].key
      this.$store.dispatch('setmenuactive',this.meneactive)
      this.$nextTick(()=>{
        
      });
    },
    methods:{
      handleOpen(key, keyPath) {
        
      },
      handleClose(key, keyPath) {
 
      },
      // 菜单激活回调
      memuselect(index){
          this.$store.dispatch('setmenuactive',index)
      }
    }
}
</script>

<style scoped>
.Aside-warp{
    height: 100%;
    width: 100%;
}
</style>


