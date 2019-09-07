<template>
  <el-container class="root_container">
    <el-header>
      <v-head></v-head>
    </el-header>

  </el-container>

</template>

<script>
  import vHead from '@/components/common/Head'
  import {getProjectList} from '../api/api'

  export default {

    name: "Function",
    components: {
      vHead,
    },
    mounted: function () {
      getProjectList().then((res) => {
        console.log(res.data.project_list)
        if (res.data.project_list.length > 0){
          let project_id = res.data.project_list[0].id
          // this.$router.push('/home/projects/'+project_id)
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
  }

  .el-main {
    color: #333;
    text-align: center;

  }

  body > .el-container {
    margin-bottom: 40px;
  }
</style>
