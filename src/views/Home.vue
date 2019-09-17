<template>
  <el-container class="root_container">
    <el-header>
      <v-head></v-head>
    </el-header>
    <el-container>
      <el-aside style="width: 201px">
<!--        <project ></project>-->
        <AsideNav :projects = "projects"></AsideNav>
      </el-aside>
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
  import vHead from '@/components/common/Head'
  import AsideNav from '@/components/common/AsideNav'
  import {getProjectList} from '../api/api'

  export default {

    name: "Home",
    components: {
      AsideNav,
      vHead,
    },
    data(){
      return{
        projects: [],
      }
    },
    mounted: function () {
      getProjectList().then((res) => {
        if (res.data.project_list.length > 0){
          this.projects = res.data.project_list
          // this.$router.push('/home/projects/'+projectId)
        }
      })
    }
  }
</script>

<style scoped lang="less">
  .el-header {
    padding: 0 !important;
  }

  .root_container {
    min-width: 1200px;
  }

  .el-aside {
    color: #333;
    padding-top: 20px;
        width: 201px;
    text-align: left;
  }

  .el-main {
    color: #333;
    text-align: center;


  }

  body > .el-container {
    margin-bottom: 40px;
  }
</style>
