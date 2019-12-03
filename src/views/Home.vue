<template>
  <el-container class="root_container">
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="200px" class="main_container">
        <aside-nav-tree ></aside-nav-tree>
      </el-aside>
      <el-main>
        <div class="tab">
          <tab-views></tab-views>
        </div>
        <div class="main_container">
          <keep-alive>
            <router-view v-if="refresh"></router-view>
          </keep-alive>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

  import Header from '@/components/common/Header'
  import tabViews from '@/components/common/tabViews'
  import asideNavTree from '@/components/common/asideNavTree'

  export default {

    name: "Home",
    components: {
      Header,
      tabViews,
      asideNavTree,
    }, provide() {
      return {
        reload: this.reload
      }
    },


    data() {
      return {
        refresh: true
      }
    },
    methods: {
      reload() {
        this.refresh = false;
        this.$nextTick(function () {
          this.refresh = true;
        })
      }
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
    padding: 10px 0 0 0;
    text-align: left;

  }

  .el-main {
    color: #333;
    text-align: center;
    padding: 0;

  }

  .tab {
    height: 45px;
  }

  body > .el-container {
    /*margin-bottom: 40px;*/
    /*width: 100%;*/
  }

  @media screen and (max-height: 800px) {
    /*屏幕宽度小于640px时显示红色字体*/
    .main_container {
      min-height: 300px;
      max-height: 700px;
    }
  }

  @media screen and (min-height: 910px) {
    /*屏幕宽度小于640px时显示红色字体*/
    .main_container {
      min-height: 700px;
      max-height: 880px;
    }
  }
</style>
