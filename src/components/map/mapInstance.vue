<template>
    <div id="map-container-wrap" class="map-container-wrap">
        <!--地图容器-->
        <div id="mapwarp" class="map-container-box"> 
            <div id="map" ref="map" >
            </div>
        </div>
        <!--地图工具条-->
        <mapToolBar ref="mapToolBar" />
        <maptool />
        <div class="ma-layers">
            <span>{{mapIndex}}</span>
        </div>
        <div class="ma-positions">
            <span>经度:</span>
            <span>{{mapcenter[0]}}</span>
            <span style="margin:0 10px"></span>
            <span>纬度:</span>
             <span>{{mapcenter[1]}}</span>
        </div>
    </div>
</template>

<script>
    import mapUtil from "@/utils/Openlayer-utils";
    import mapToolBar from "./component/mapToolBar";
    import maptool from './component/maptool'
    import {Overlay} from "ol";
    export default {
        name: "mapInstance",
        props: {
            baseMapName: {
                type: String,
                default: "img"
            }
        },
        data() {
            return {
                mapInstance: null,
                mapPopup: null,
            }
        },
        components: {
            mapToolBar,maptool
        },
        computed:{
            // 获取当前地图所在层级
            mapIndex(){
                return this.$store.state.menuData.mapIndex;
            },
            mapcenter(){
                return this.$store.state.menuData.mapceter;
            },
            affix(){
                 return this.$route.meta.affix;
            }
        },
        watch:{
             //监听地图所在层级变化
            mapIndex(newval,oldval){
                
            },
            // 监听鼠标滑过位置
            mapcenter(newval,oldval){

            },
            $route(newval,oldval){

            },
        },
        mounted() {
            //初始化地图
            this.mapInstance = mapUtil.initMap('mapwarp');
            this.mapContainerSize();
            //当浏览器改变时,改变地图容器高度
             window.addEventListener("resize", this.mapContainerSize);
             let classname = ''
            this.$nextTick(() => {
                //加载地图底图,默认为img
                this.$refs.mapToolBar.switchBaseLyr('img','full-btnimg','卫星图')
                // mapUtil.addmap()
                // this.addmapserver()
                if(this.affix){
                    classname = 'ol-scale-line'
                 
                }else{
                    classname = 'ol-scale-line'
                }
                    mapUtil.addScaleLine('scale',classname)//地图增加比例尺
               
               
            });
        },
        methods: {
            //容器尺寸
            mapContainerSize() {
                let tagsHeight = document.getElementById('layout-warp').offsetHeight;
                mapUtil.setMapHeight(tagsHeight);
            },
            addmapserver(){
                // 'http://10.1.15.41:6060/geoserver/slgis/wms'
                let url='http://10.1.15.41:6060/geoserver/slgis/wms'
                let name = 'servermaop'
                let leaver = 19
                let leavername = 'slgis:qgsxsjhb'
                mapUtil.wmsTileLayer(url,leavername,name,leaver,leavername)
            },
        }
    }
</script>

<style scoped>
  .map-container-wrap{
      position: relative;
      height: 100%;
      width: 100%;
      /* background: rgba(184,232,248,.7); */
  }
.ma-layers{
    position: fixed;
    bottom: 10px;
    left: 130px;
    background: rgba(6,30,62,.8);
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;
    width: 50px;
    border-radius: 5px;
    color: #fff;
}
.ma-positions{
    position: fixed;
    bottom: 10px;
    left: 190px;
    background: rgba(6,30,62,.8);
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;
    min-width: 100px;
    border-radius: 5px;
    color: #fff;
    padding: 0 10px;
}
</style>
