<template>
    <div class="tree-row testscrollbar">
        <ul class="tree-warp ">
            <li  v-for="item in lengthlist" :key="item.id" class="tree-lis">
               <div class="tree-lis-check">
                    <div>
                        <i class="fa fa-caret-down faiconfonts"  v-if="item.lendlist" v-show="item.showlend" @click="showChildrenclick(item)"></i>
                        <i class="fa fa-caret-up faiconfonts" style="color:#22E13C" v-if="!item.lendlist" v-show="item.showlend" @click="showChildrenclick(item)"></i>
                        <span>{{item.label}}</span>
                    </div>
                    
                       
                </div>

                <div class="featurestyle"  v-show="!item.showlend" v-if="item.lendlist">
                    <ul class="lendclasslse">
                        <li v-for="lend in item.lendlist" :key="lend.pictureId">
                             <span>{{lend.pictureName}}</span>
                            <img :src="lend.imgurl" alt=""  :class="lend.lendImgType =='point'?'pointimg': 'lineimg'" >
                           
                        </li>
                    </ul>
                </div>
                   
                
            </li>
        </ul>
    </div>
</template>

<script>
// import treelist from '../../../public/data/tree.json'
import mapUtil from "@/utils/Openlayer-utils";
import slider from '@/components/slider/index'
import {getlendlist} from '@/api/generalmessage/index.js'
export default {
    name:'legthtree',
    components:{
        slider,
    },
    props:{
       
    },
    data(){
        return{
           
            lengthlist:[],
        }
    },
    computed:{
        isclearmap(){
            return this.$store.state.menuData.isclearmap;
        },
        legthlist(){
         
            return this.$store.state.menuData.legthlist;
        }
    },
    watch:{
            legthlist(newvla,oldval){
              this.lengthlist = newvla
            }
    },
    mounted(){
     
        this.$nextTick(()=>{
            
        });
    },
    methods:{
        // 是否展示子元素的切换事件
        showChildrenclick(row){
            row.showlend = !row.showlend
        },
    }
}
</script>


<style scoped>
.tree-row{
    width: 100%;
    height: 89%;
    padding: 0 0px 0 6px;
    overflow-y: auto;
}
.tree-warp{
    width: 100%;
}
.tree-lis{
    display: flex;
    justify-content: space-between;
    color: #fff;
    flex-wrap: wrap;
}
.tree-lis i{
    cursor: pointer;
}
.fontfastyle{
    color: #ccc;
    font-size: 12px;
}
.tree-lis-check{
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 10px;
}
.featurestyle{
    /* height: 140px; */
    width: 99%;
    margin-top: 7px;
    background: rgba(220,218,193, .3);
    border-radius: 4px;
    padding: 5px 10px;
    overflow-x: auto;
    overflow-y: hidden;
}
.iconsfastuyle{
    display: flex;
    align-items: center;
    width: 33%;
}
.nohaschildren{
    justify-content: flex-end;
}
.haschildren{
    justify-content: flex-start;
}
.faiconfonts{
    color: #F8A30B;
}
.stylemapserverspan{
    font-size:10px;
    margin-right: 5px;
    cursor: pointer;
    
}
.stylemapserverspan:hover{
    color: #EA810E;
}
.sharestyleicon{
    font-size: 15px;
    color: #EA9F0E;
    margin-right:0 6px;
}
.mapstyles{
    display: flex;
    align-items: center;
}
.mapstyles>span{
    font-size: 14px;
    width: 80px;
}
.lendclasslse{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.lendclasslse>li{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 50%;
    align-items: center;
    margin-bottom: 10px;
}
.lendclasslse>li .pointimg{
  /* height: 20px;
    width: 20px; */
}

.lendclasslse>li .lineimg{
  /* height: 10px;
    width: 50px; */
}

.lendclasslse>li span{
    width:75px;
    font-size: 14px;
    text-align: center;
}
.isopen{
    color: #EA810E;
}
.isup{
    color: #0EB9EA;
}
</style>