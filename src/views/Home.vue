<template>
  <el-container class="root_container">
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <aside-nav></aside-nav>
      </el-aside>
      <el-main>
        <div class="tab">
          <tab-views></tab-views>
        </div>

        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

  import Header from '@/components/common/Header'
  import tabViews from '@/components/common/tabViews'
  import asideNav from '@/components/common/asideNav'

  export default {

    name: "Home",
    components: {
      Header,
      tabViews,
      asideNav,
    }
  }
</script>

<style scoped lang="less">
  .el-header {
    height: 60px;
    color: #000000;
    text-align: center;
    line-height: 60px;
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
  .tab{
    height: 45px;
  }

  body > .el-container {
    margin-bottom: 40px;
    width: 100%;
  }
</style>
