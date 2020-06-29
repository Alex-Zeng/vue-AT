<template>
  <el-container class="root_container">
    <el-header>
      <Header></Header>
    </el-header>
    <div class="tab">
      <tab-views></tab-views>
    </div>
    <el-container>

      <el-main>

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
  import {mapState} from "vuex"

  export default {

    name: "Home",
    components: {
      Header,
      tabViews,
      asideNavTree,
    },

    provide() {
      return {
        reload: this.reload
      }
    },


    data() {
      return {
        refresh: true,
      }
    },
    methods: {
      reload() {
        this.refresh = false;
        this.$nextTick(function () {
          this.refresh = true;
        })
      },
    }
  }
</script>

<style scoped lang="less">
  .el-header {
    color: #000000;
    text-align: center;
  }

  .root_container {
    min-width: 1220px;

  }

  .el-aside {
    color: #333;
    padding: 0 0 0 0;
    text-align: left;

  }

  .el-main {
    color: #333;
    text-align: center;

  }

  .tab {
    height: 20px;
    padding-bottom: 20px;

  }

  body > .el-container {
    /*margin-bottom: 40px;*/
    /*width: 100%;*/
  }

</style>
