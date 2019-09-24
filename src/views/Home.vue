<template>
  <el-container class="root_container">

          <el-aside >
<!--        <project ></project>-->
        <aside-nav></aside-nav>
      </el-aside>
    <el-container>

      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>

  import AsideNav from '@/components/common/AsideNav'

  export default {

    name: "Home",
    components: {
      AsideNav,
    }
  }
</script>

<style scoped lang="less">
  .el-header {
    padding: 0 5px!important;
  }

  .root_container {
    min-width: 1220px;
  }

  .el-aside {
    color: #333;
    padding: 5px;
    text-align: left;

  }

  .el-main {
    color: #333;
    text-align: center;
    padding: 5px;

  }

  body > .el-container {
    margin-bottom: 40px;
    width: 100%;
  }
</style>
