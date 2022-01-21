<template>
    <el-dropdown class="avatar-container right-menu-item hover-effect" :hide-on-click='false' trigger="click">
        <div class="avatar-wrapper">
         
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item divided @click.native="logout">
            <el-button type="text"><i class="el-icon-user-solid"></i>退出登录</el-button>
          </el-dropdown-item>
    
        </el-dropdown-menu>
      </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data(){
        return{
          avatar:require("@/assets/image/watrelog.jpg"),
          btnloading:false,
        }
    },
    name:'Usercomd',
    computed:{
            ...mapGetters([
      'sidebar',
      'device'
    ]),
    },
    methods:{
      async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      })
    },
    }
}
</script>

<style scoped>
/deep/.el-button--text{
  color:#606266
}
</style>

<style lang="scss" scoped>

.right-menu-item {
      display: inline-block;
      padding: 0 8px;
    //   height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

 .avatar-container {
      /*margin-right: 30px;*/

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        }

        .el-icon-caret-bottom {
        display: none;
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
        }
      }
    }
</style>
